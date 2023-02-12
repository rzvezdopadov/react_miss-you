import * as React from "react";
import { useEffect, useRef } from "react";
import { useQueryDeletePhoto } from "../../hooks/api.hook";
import { IQueryPhoto } from "../../interfaces/iquery";
import { store } from "../../store/store";
import { modalPhotoDeleteAction } from "../../store/redusers/modal";
import { userMyProfileAction } from "../../store/redusers/profile";
import { ButtonCancel, ButtonYes } from "../utils/Buttons";

export function openModalPhotoDelete(photoPos: number) {
	store.dispatch(modalPhotoDeleteAction(true, photoPos));
}

export function ModalPhotoDelete() {
	const { modalPhotoDelete, userMyProfile } = store.getState();
	const refModalPhotoDelete = useRef<HTMLDivElement>(null);
	const { data, error, queryDeletePhoto } = useQueryDeletePhoto();

	useEffect(() => {
		return () => {
			closeModalPhotoDeleteHandler();
		};
	}, []);

	useEffect(() => {
		if (!refModalPhotoDelete.current) return;

		if (modalPhotoDelete.enabled) {
			refModalPhotoDelete.current.classList.remove("invisible");
		} else {
			refModalPhotoDelete.current.classList.add("invisible");
		}
	}, [modalPhotoDelete.enabled]);

	useEffect(() => {
		if (data) {
			const newUserMyProfile = { ...userMyProfile };
			newUserMyProfile.photolink = data.photolink;
			newUserMyProfile.photomain = data.photomain;

			store.dispatch(userMyProfileAction(newUserMyProfile));
		}

		store.dispatch(modalPhotoDeleteAction(false, 0));
	}, [data, error]);

	const closeModalPhotoDeleteHandler = () => {
		store.dispatch(modalPhotoDeleteAction(false, 0));
	};

	const yesModalPhotoDeleteHandler = () => {
		const data: IQueryPhoto = {
			photoPos: modalPhotoDelete.photoPos,
		};

		queryDeletePhoto(data);
	};

	return (
		<div
			ref={refModalPhotoDelete}
			className="flex flex-col fixed justify-center items-center bg-gray-900 shadow-[0px_0px_5px_5px] shadow-lime-300 text-neutral-50 rounded-xl top-0 bottom-0 left-0 right-0 m-auto px-2 pt-2 z-30 pb-2 h-36 w-80"
		>
			<div className="flex">{`Вы действительно хотите удалить ${
				modalPhotoDelete.photoPos + 1
			}-е фото?`}</div>
			<div className="flex justify-center h-6 w-full">
				<ButtonYes onClick={yesModalPhotoDeleteHandler} />
				<ButtonCancel onClick={closeModalPhotoDeleteHandler} />
			</div>
		</div>
	);
}
