import * as React from "react";
import { useEffect, useRef } from "react";
import { store } from "../../store/store";
import { IStickerpack } from "../../interfaces/istickers";
import {
	initialStateModalAddDeleteStickerpack,
	modalAddDeleteStickerpackAction,
} from "../../store/redusers/modal";
import { userMyProfileAction } from "../../store/redusers/profile";
import { modalMessageOpen } from "./ModalMessage";
import { ButtonCancel, ButtonYes } from "../utils/Buttons";
import {
	useQueryAddStickerpack,
	useQueryDeleteStickerpack,
} from "../../api/sticker/sticker.api.hook";

export function modalAddDeleteStickerpackOpen(stickerpack: IStickerpack) {
	store.dispatch(modalAddDeleteStickerpackAction(true, stickerpack));
}

export function ModalAddDeleteStickerpack() {
	const { modalAddDeleteStickerpack, userMyProfile } = store.getState();
	const refAddDeleteStickerpack = useRef<HTMLDivElement>(null);
	const { dataAddStickerpack, errorAddStickerpack, querySendAddStickerpack } =
		useQueryAddStickerpack();
	const {
		dataDeleteStickerpack,
		errorDeleteStickerpack,
		querySendDeleteStickerpack,
	} = useQueryDeleteStickerpack();

	useEffect(() => {
		if (!refAddDeleteStickerpack.current) return;

		if (modalAddDeleteStickerpack.enabled) {
			refAddDeleteStickerpack.current.classList.remove("invisible");
		} else {
			refAddDeleteStickerpack.current.classList.add("invisible");
		}
	}, [modalAddDeleteStickerpack.enabled]);

	useEffect(() => {
		if (!dataAddStickerpack) return;

		store.dispatch(userMyProfileAction(dataAddStickerpack));
		modalMessageOpen("Выполнено успешно!");
		closeModalAddDeleteStickerpackHandler();
	}, [dataAddStickerpack]);

	useEffect(() => {
		if (!errorAddStickerpack) return;

		modalMessageOpen(errorAddStickerpack.response.data.message);
		closeModalAddDeleteStickerpackHandler();
	}, [errorAddStickerpack]);

	useEffect(() => {
		if (!dataDeleteStickerpack) return;

		store.dispatch(userMyProfileAction(dataDeleteStickerpack));
		modalMessageOpen("Выполнено успешно!");
		closeModalAddDeleteStickerpackHandler();
	}, [dataDeleteStickerpack]);

	useEffect(() => {
		if (!errorDeleteStickerpack) return;

		modalMessageOpen(errorDeleteStickerpack.response.data.message);
		closeModalAddDeleteStickerpackHandler();
	}, [errorDeleteStickerpack]);

	const closeModalAddDeleteStickerpackHandler = () => {
		store.dispatch(
			modalAddDeleteStickerpackAction(
				false,
				initialStateModalAddDeleteStickerpack.stickerpack
			)
		);
	};

	const yesModalAddDeleteStickerpackHandler = () => {
		if (!modalAddDeleteStickerpack.stickerpack.idstickerpack) return;

		if (
			userMyProfile.stickerpacks.includes(
				modalAddDeleteStickerpack.stickerpack.idstickerpack
			)
		) {
			querySendDeleteStickerpack(
				modalAddDeleteStickerpack.stickerpack.idstickerpack
			);
		} else {
			querySendAddStickerpack(
				modalAddDeleteStickerpack.stickerpack.idstickerpack
			);
		}
	};

	return (
		<div
			ref={refAddDeleteStickerpack}
			className="flex flex-col fixed justify-center items-center bg-gray-900 shadow-[0px_0px_5px_5px] shadow-lime-300 text-neutral-50 rounded-xl top-0 bottom-0 left-0 right-0 m-auto px-2 pt-2 z-30 pb-2 h-36 w-80"
		>
			{userMyProfile.stickerpacks.includes(
				modalAddDeleteStickerpack.stickerpack.idstickerpack
			) ? (
				<div className="flex">{`Вы действительно хотите удалить стикерпак "${modalAddDeleteStickerpack.stickerpack.name}" из своих стикеров?`}</div>
			) : modalAddDeleteStickerpack.stickerpack.price ? (
				<div className="flex">{`Вы действительно хотите купить стикерпак "${modalAddDeleteStickerpack.stickerpack.name}" за ${modalAddDeleteStickerpack.stickerpack.price} MY-баллов?`}</div>
			) : (
				<div className="flex">{`Вы действительно хотите добавить стикерпак "${modalAddDeleteStickerpack.stickerpack.name}"?`}</div>
			)}
			<div className="flex justify-center h-6 w-full">
				<ButtonYes onClick={yesModalAddDeleteStickerpackHandler} />
				<ButtonCancel onClick={closeModalAddDeleteStickerpackHandler} />
			</div>
		</div>
	);
}
