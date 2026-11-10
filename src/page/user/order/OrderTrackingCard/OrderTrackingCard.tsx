'use client';

import clsx from 'clsx';
import {BoxTick, Calendar, Call, CloseCircle, Location, NoteText, Receipt21, TickCircle, TruckFast, User} from 'iconsax-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import {memo} from 'react';
import StateActive from '~/components/utils/StateActive';
import {PATH} from '~/constants/config';
import {listClientStateOrder, ORDER_STATUS} from '~/constants/config/order';
import {convertCoin} from '~/funcs/convertCoin';
import {formatPhoneVN} from '~/funcs/optionConvert';
import styles from './OrderTrackingCard.module.scss';
import type {PropsOrderTrackingCard} from './interfaces';

const TIMELINE_STEPS = [
	{
		status: ORDER_STATUS.PENDING,
		label: 'Đang chờ xác nhận',
		icon: Receipt21,
	},
	{
		status: ORDER_STATUS.COMPLETED,
		label: 'Đã xác nhận',
		icon: BoxTick,
	},
	{
		status: ORDER_STATUS.SUCCESS,
		label: 'Giao hàng thành công',
		icon: TruckFast,
	},
];

function OrderTrackingCard({order}: PropsOrderTrackingCard) {
	const currentMeta = listClientStateOrder.find((s) => s.state === order.order_status);
	const isCancelled = order.order_status === ORDER_STATUS.CANCELLED;
	const currentStepIndex = TIMELINE_STEPS.findIndex((step) => step.status === order.order_status);

	const getImageUrl = (image?: string) => {
		if (!image) return '/images/banner-home.jpg';
		if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${image}`;
	};

	return (
		<div className={styles.card}>
			{/* Card Header */}
			<div className={styles.card_head}>
				<div className={styles.code_group}>
					<span className={styles.code_label}>Mã đơn hàng:</span>
					<strong className={styles.code_value}>{order.code}</strong>
					<span className={styles.created_at}>
						<Calendar size='15' color='#6b7280' />
						{moment(order.created_at).format('HH:mm - DD/MM/YYYY')}
					</span>
				</div>

				<StateActive stateActive={order.order_status} listState={listClientStateOrder} />
			</div>

			{/* Timeline tiến độ */}
			{isCancelled ? (
				<div className={styles.cancelled_banner}>
					<CloseCircle size='20' color='#dc2626' variant='Bold' />
					<div>
						<strong>Đơn hàng đã bị hủy</strong>
						<p>{currentMeta?.description || 'Đơn hàng bị hủy do hết hàng hoặc theo yêu cầu khách.'}</p>
					</div>
				</div>
			) : (
				<div className={styles.timeline_section}>
					<div className={styles.timeline}>
						{TIMELINE_STEPS.map((step, index) => {
							const Icon = step.icon;
							const isCompleted = currentStepIndex > index;
							const isCurrent = currentStepIndex === index;
							const isActive = currentStepIndex >= index;

							return (
								<div
									key={step.status}
									className={clsx(styles.step, {
										[styles.active]: isActive,
										[styles.current]: isCurrent,
										[styles.completed]: isCompleted,
									})}
								>
									{index > 0 && <div className={clsx(styles.connector, {[styles.connector_active]: isActive})} />}

									<div className={styles.step_dot}>
										{isCompleted ? (
											<TickCircle size='20' color='#ffffff' variant='Bold' />
										) : (
											<Icon size='18' color={isActive ? '#ffffff' : '#9ca3af'} variant='Bold' />
										)}
									</div>

									<div className={styles.step_text}>
										<span className={styles.step_title}>{step.label}</span>
									</div>
								</div>
							);
						})}
					</div>

					{currentMeta?.description && <p className={styles.status_desc}>{currentMeta.description}</p>}
				</div>
			)}

			{/* Customer & Shipping Info */}
			<div className={styles.info_grid}>
				<div className={styles.info_item}>
					<User size='16' color='#00b7c4' variant='Bold' />
					<div>
						<span className={styles.info_label}>Người nhận</span>
						<p className={styles.info_value}>{order.customer_name}</p>
					</div>
				</div>

				<div className={styles.info_item}>
					<Call size='16' color='#00b7c4' variant='Bold' />
					<div>
						<span className={styles.info_label}>Số điện thoại</span>
						<p className={styles.info_value}>{formatPhoneVN(order.customer_phone)}</p>
					</div>
				</div>

				<div className={clsx(styles.info_item, styles.info_full)}>
					<Location size='16' color='#00b7c4' variant='Bold' />
					<div>
						<span className={styles.info_label}>Địa chỉ giao hàng</span>
						<p className={styles.info_value}>{order.shipping_address}</p>
					</div>
				</div>

				{order.customer_note && (
					<div className={clsx(styles.info_item, styles.info_full)}>
						<NoteText size='16' color='#00b7c4' variant='Bold' />
						<div>
							<span className={styles.info_label}>Ghi chú</span>
							<p className={styles.info_value}>{order.customer_note}</p>
						</div>
					</div>
				)}
			</div>

			{/* Items Snapshot */}
			<div className={styles.items_section}>
				<h5 className={styles.items_heading}>Sản phẩm đã đặt ({order.items?.length || 0})</h5>
				<div className={styles.items_list}>
					{order.items?.map((item, idx) => (
						<div key={`${item.product_id}-${idx}`} className={styles.item_row}>
							<Link href={`${PATH.Product}/${item.product_id}`} className={styles.item_img_wrap}>
								<Image
									src={getImageUrl(item.product_image)}
									alt={item.product_name}
									fill
									sizes='56px'
									className={styles.item_img}
								/>
							</Link>

							<div className={styles.item_info}>
								<Link href={`${PATH.Product}/${item.product_id}`} className={styles.item_name}>
									{item.product_name}
								</Link>
								<div className={styles.item_meta}>
									{item.pack_size && <span className={styles.pack_size}>{item.pack_size}</span>}
									<span className={styles.qty_price}>
										{item.quantity} x {convertCoin(item.price)}₫
									</span>
								</div>
							</div>

							<div className={styles.item_subtotal}>{convertCoin(item.subtotal)}₫</div>
						</div>
					))}
				</div>
			</div>

			{/* Total Footer */}
			<div className={styles.card_foot}>
				<span>Tổng thanh toán</span>
				<strong className={styles.total_amount}>{convertCoin(order.total_amount)}₫</strong>
			</div>
		</div>
	);
}

export default memo(OrderTrackingCard);
