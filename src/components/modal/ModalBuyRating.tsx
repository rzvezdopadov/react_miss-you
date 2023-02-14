import * as React from "react";
import { useEffect, useRef } from "react";
import { store } from "../../store/store";
import { IRate } from "../../interfaces/ishop";
import {
	initialStateModalBuyRating,
	modalBuyRatingAction,
} from "../../store/redusers/modal";
import { userMyProfileAction } from "../../store/redusers/profile";
import { modalMessageOpen } from "./ModalMessage";
import { ButtonCancel, ButtonYes } from "../utils/Buttons";
import { useQueryBuyRating } from "../../api/rating/rating.api.hook";
import { ModalYesCancelWrapper } from "../wrappers/ModalYesCancelWrapper";

export function openModalBuyRating(rate: IRate) {
	store.dispatch(modalBuyRatingAction(true, rate));
}

export function ModalBuyRating() {
	const { modalBuyRating } = store.getState();
	const { dataBuyRating, errorBuyRating, querySendBuyRating } =
		useQueryBuyRating();

	useEffect(() => {
		return () => {
			closeModalBuyRatingHandler();
		};
	}, []);

	useEffect(() => {
		if (dataBuyRating) {
			store.dispatch(userMyProfileAction(dataBuyRating));
			modalMessageOpen("Покупка прошла успешно!");
		} else if (errorBuyRating) {
			modalMessageOpen(errorBuyRating.response.data.message);
		}

		closeModalBuyRatingHandler();
	}, [dataBuyRating, errorBuyRating]);

	const closeModalBuyRatingHandler = () => {
		store.dispatch(
			modalBuyRatingAction(false, initialStateModalBuyRating.rate)
		);
	};

	const yesModalBuyRatingHandler = () => {
		if (!modalBuyRating.rate.idRate) return;

		querySendBuyRating(modalBuyRating.rate.idRate);
	};

	return (
		<ModalYesCancelWrapper enabled={modalBuyRating.enabled}>
			<>
				<div className="flex">{`Вы действительно хотите купить ${modalBuyRating.rate.amountRate} баллов рейтинга за ${modalBuyRating.rate.price} MY-баллов?`}</div>
				<div className="flex justify-center h-6 w-full">
					<ButtonYes onClick={yesModalBuyRatingHandler} />
					<ButtonCancel onClick={closeModalBuyRatingHandler} />
				</div>
			</>
		</ModalYesCancelWrapper>
	);
}
