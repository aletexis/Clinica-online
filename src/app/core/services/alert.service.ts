import { Injectable } from '@angular/core';
import Swal, { SweetAlertPosition } from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	show(options: {
		title: string,
		text?: string,
		iconHtml?: string,
		imageUrl?: string,
		imageWidth?: number,
		imageHeight?: number,
		position?: SweetAlertPosition,
		background?: string,
		customClass?: any,
		timer?: number
	}) {
		Swal.fire({
			toast: true,
			position: options.position || 'bottom-end',
			showConfirmButton: false,
			timer: options.timer ?? 2500,
			timerProgressBar: true,
			title: options.title,
			text: options.text,
			iconHtml: options.iconHtml,
			imageUrl: options.imageUrl,
			imageWidth: options.imageWidth,
			imageHeight: options.imageHeight,
			background: options.background || '#EBEBEB',
			color: '#415464',
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer);
				toast.addEventListener('mouseleave', Swal.resumeTimer);
			}
		});
	}

	success(title: string, timer?: number) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-check-circle" style="color:#01A25F;font-size:1.4rem;border:none;"></i>',
			timer: timer
		});
	}

	error(title: string, timer?: number) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-times-circle" style="color:#F55376;font-size:1.4rem"></i>',
			timer: timer
		});
	}

	info(title: string, timer?: number) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-info-circle" style="color:#00AACC;font-size:1.4rem"></i>',
			timer: timer
		});
	}

	warning(title: string, timer?: number) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-exclamation-triangle" style="color:#F5BC00;font-size:1.4rem;"></i>',
			timer: timer
		});
	}
}