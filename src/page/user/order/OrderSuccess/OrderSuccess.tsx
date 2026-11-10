import {ArrowLeft, SearchNormal1, ShoppingBag, TickCircle} from 'iconsax-react';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import {convertCoin} from '~/funcs/convertCoin';
import styles from './OrderSuccess.module.scss';
import type {PropsOrderSuccess} from './interfaces';

function OrderSuccess({order, onClose}: PropsOrderSuccess) {
	return (
		<div className={styles.order_success}>
			<div className={styles.icon}>
				<TickCircle size='40' color='#10b981' variant='Bold' />
			</div>

			<h4 className={styles.title}>Đặt hàng thành công!</h4>
			<p className={styles.note}>
				Cảm ơn bạn đã đặt hàng tại <strong>Văn phòng phẩm Huyền Anh</strong>. Đơn hàng của bạn đang chờ xác nhận và xử lý.
			</p>

			{order && (
				<div className={styles.order_meta}>
					<div className={styles.meta_row}>
						<span>Mã đơn hàng</span>
						<strong className={styles.order_code}>{order.code}</strong>
					</div>
					<div className={styles.meta_row}>
						<span>Tổng tiền</span>
						<strong className={styles.order_total}>{convertCoin(order.total_amount)}₫</strong>
					</div>
					<p className={styles.tracking_hint}>
						Bạn có thể sử dụng Mã đơn hàng này hoặc Số điện thoại để tra cứu tiến độ đơn hàng.
					</p>
				</div>
			)}

			<div className={styles.actions}>
				{order?.code && (
					<Button
						icon={<SearchNormal1 size='18' color='#fff' />}
						bright-cyan
						bold
						rounded_8
						p_10_24
						href={`${PATH.TrackingOrder}?_q=${order.code}`}
						onClick={onClose}
					>
						Tra cứu đơn hàng
					</Button>
				)}
				<Button
					icon={<ShoppingBag size='18' color={order?.code ? '#202939' : '#fff'} variant='Bold' />}
					bright-cyan={!order?.code}
					white={!!order?.code}
					bold
					rounded_8
					p_10_24
					href={PATH.Product}
					onClick={onClose}
				>
					Tiếp tục mua hàng
				</Button>
				<Button
					icon={<ArrowLeft size='18' color='#202939' />}
					white
					bold
					rounded_8
					p_10_24
					href={PATH.Home}
					onClick={onClose}
				>
					Quay về trang chủ
				</Button>
			</div>
		</div>
	);
}

export default OrderSuccess;

