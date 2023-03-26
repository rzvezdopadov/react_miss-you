import React from "react";
import {
	PAID_API_TARIFFS,
	PAID_API_TARIFFS_BUY,
} from "../../../../api/shop/paid/ipaid.api";
import {
	useQueryBuyPaidTariff,
	useQueryGetPaidTariffs,
} from "../../../../api/shop/paid/paid.api.hook";
import {
	ITariff,
	ITariffModal,
	PAID_PROPERTY,
} from "../../../../interfaces/ishop";
import { store } from "../../../../store/store";
import { Label, LabelWidget } from "../../../utils/Labels";
import { PaidTariff } from "./PaidTariff";
import { ModalYesCancelWrapper } from "../../../wrappers/ModalYesCancelWrapper";
import { ButtonsYesCancelWidget } from "../../utils/Buttons";
import { modalMessageOpen } from "../../../modal/ModalMessage";
import { userMyProfileAction } from "../../../../store/redusers/profile";
import { getDateTimeFromTimeCode } from "../../../../helpers/datetime";

interface IPaidWidgetPayload {
	paidProperty: PAID_PROPERTY;
	linkAPITariffs: PAID_API_TARIFFS;
	linkAPITariffsBuy: PAID_API_TARIFFS_BUY;
	header: string;
	discriptions: string;
}

export function Paid(payload: IPaidWidgetPayload) {
	const { userMyProfile } = store.getState();
	const [paidTariffs, setPaidTariffs] = React.useState<ITariff[]>([]);
	const { dataPaidTariffs, errorPaidTariffs, querySendGetPaidTariffs } =
		useQueryGetPaidTariffs(payload.linkAPITariffs);

	const initTariff: ITariff = {
		idTariff: "",
		amountDay: 0,
		discount: 0,
		price: 0,
	};
	const { dataBuyPaidTariff, errorBuyPaidTariff, querySendBuyPaidTariff } =
		useQueryBuyPaidTariff(payload.linkAPITariffsBuy);
	const [modalTariff, setModalTariff] = React.useState<ITariffModal>({
		enabled: false,
		tariff: initTariff,
	});

	React.useEffect(() => {
		querySendGetPaidTariffs(payload.linkAPITariffs);
	}, []);

	React.useEffect(() => {
		if (!dataPaidTariffs) return;

		setPaidTariffs(dataPaidTariffs);
	}, [dataPaidTariffs]);

	React.useEffect(() => {
		if (dataPaidTariffs) {
			setPaidTariffs(dataPaidTariffs);
		} else if (errorPaidTariffs) {
			modalMessageOpen(errorPaidTariffs.response.data.message);
		}
	}, [dataPaidTariffs, errorPaidTariffs]);

	React.useEffect(() => {
		if (!dataBuyPaidTariff) return;

		store.dispatch(userMyProfileAction(dataBuyPaidTariff));
		modalMessageOpen("Покупка прошла успешно!");
		modalBuyRatingCloseHandler();
	}, [dataBuyPaidTariff]);

	React.useEffect(() => {
		if (!errorBuyPaidTariff) return;

		modalMessageOpen(errorBuyPaidTariff.response.data.message);
		modalBuyRatingCloseHandler();
	}, [errorBuyPaidTariff]);

	const modalBuyRatingCloseHandler = () =>
		setModalTariff({ enabled: false, tariff: initTariff });

	return (
		<div
			className={`flex flex-col justify-start items-center w-full h-full`}
		>
			<LabelWidget value={payload.header} />
			<Label value={payload.discriptions} />
			{userMyProfile.paid[payload.paidProperty].enabled ? (
				<LabelWidget
					value={`Активировано до ${getDateTimeFromTimeCode(
						userMyProfile.paid[payload.paidProperty].timecode
					)}`}
				/>
			) : (
				<LabelWidget value={"Не активировано"} />
			)}
			<div className="flex justify-center flex-wrap m-4 w-full">
				{paidTariffs.length ? (
					paidTariffs.map((tariff, i) => {
						return (
							<PaidTariff
								key={tariff.idTariff}
								tariff={paidTariffs[i]}
								openModalClbk={() =>
									setModalTariff({
										enabled: true,
										tariff: tariff,
									})
								}
							/>
						);
					})
				) : (
					<div className="flex">Тарифы пока отсутствуют ^..^</div>
				)}
			</div>

			<ModalYesCancelWrapper enabled={modalTariff.enabled}>
				<Label
					value={`Вы действительно хотите купить опцию на +${modalTariff.tariff.amountDay} дней за ${modalTariff.tariff.price} MY-баллов?`}
				/>
				<ButtonsYesCancelWidget
					onClickYes={() => {
						querySendBuyPaidTariff(modalTariff.tariff.idTariff);
					}}
					onClickCancel={modalBuyRatingCloseHandler}
				/>
			</ModalYesCancelWrapper>
		</div>
	);
}
