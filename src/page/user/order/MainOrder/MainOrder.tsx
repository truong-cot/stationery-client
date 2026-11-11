'use client';

import {useMutation} from '@tanstack/react-query';
import {ArrowLeft, TickCircle} from 'iconsax-react';
import {Fragment, useEffect, useMemo, useState} from 'react';
import {BsCartXFill} from 'react-icons/bs';
import {useDispatch, useSelector} from 'react-redux';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import FlexLayout from '~/components/layout/FlexLayout';
import GridColumn from '~/components/layout/GridColumn';
import LayoutGrid from '~/components/layout/LayoutGrid';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {formatPhoneVN} from '~/funcs/optionConvert';
import {toastWarn} from '~/funcs/toast';
import clientServices, {IClientOrderResponse} from '~/services/client.service';
import {RootState} from '~/store';
import {clearCart} from '~/store/cart.slice';
import OrderSuccess from '../OrderSuccess';
import ProductOrder from '../ProductOrder';
import styles from './MainOrder.module.scss';
import type {PropsMainOrder} from './interfaces';

interface IFormOrder {
	customer_name: string;
	customer_phone: string;
	shipping_address: string;
	customer_note: string;
}

const initForm: IFormOrder = {
	customer_name: '',
	customer_phone: '',
	shipping_address: '',
	customer_note: '',
};

function MainOrder({}: PropsMainOrder) {
	const dispatch = useDispatch();

	const {carts} = useSelector((state: RootState) => state.cart);
	const {contact} = useSelector((state: RootState) => state.user);

	const [openOrderSuccess, setOpenOrderSuccess] = useState<boolean>(false);
	const [createdOrder, setCreatedOrder] = useState<IClientOrderResponse | null>(null);
	const [form, setForm] = useState<IFormOrder>(initForm);

	useEffect(() => {
		window.scrollTo(0, 0);
		const rafId = requestAnimationFrame(() => {
			window.scrollTo(0, 0);
		});
		return () => cancelAnimationFrame(rafId);
	}, []);

	const totalQuantity = useMemo(() => {
		return carts.reduce((sum, item) => sum + item.quantity, 0);
	}, [carts]);

	const totalPrice = useMemo(() => {
		return carts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
	}, [carts]);

	const phoneNumber = contact?.phone || '0384728493';
	const formattedPhone = formatPhoneVN(phoneNumber);

	const funcOrder = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: false,
				http: clientServices.createOrder({
					customer_name: form.customer_name.trim(),
					customer_phone: form.customer_phone.trim(),
					shipping_address: form.shipping_address.trim(),
					customer_note: form.customer_note.trim() || undefined,
					items: carts.map((item) => ({
						product_id: item.product._id,
						quantity: item.quantity,
					})),
				}),
			}),
		onSuccess: (data: IClientOrderResponse) => {
			setCreatedOrder(data);
			setForm(initForm);
			setOpenOrderSuccess(true);
			dispatch(clearCart());
		},
	});

	const handleSubmit = () => {
		if (carts.length === 0) {
			return toastWarn({msg: 'Giỏ hàng đang trống, vui lòng chọn sản phẩm trước khi đặt hàng!'});
		}

		return funcOrder.mutate();
	};

	return (
		<Fragment>
			<Loading loading={funcOrder.isPending} />

			<div className={styles.main_order}>
				<LayoutGrid>
					<div className={styles.breadcrumb}>
						<Breadcrumb
							isPadding={false}
							listUrls={[
								{path: PATH.Home, title: 'Trang chủ'},
								{path: PATH.Product, title: 'Sản phẩm'},
								{path: '', title: 'Đặt hàng'},
							]}
						/>
					</div>

					<h1 className={styles.title}>Đặt mua hàng</h1>
					<p className={styles.description}>Điền đầy đủ thông tin nhận hàng để hoàn tất đơn hàng tại Văn phòng phẩm Huyền Anh.</p>

					{carts.length > 0 ? (
						<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
							<div className={styles.main}>
								<div className={styles.form}>
									<h4>Thông tin khách hàng</h4>
									<div className={styles.line} />

									<FlexLayout column gap-16>
										<GridColumn col_2>
											<Input
												label={
													<span>
														Họ và tên người nhận <span style={{color: 'red'}}>*</span>
													</span>
												}
												placeholder='Nhập họ và tên'
												type='text'
												name='customer_name'
												isRequired
												isBlur
											/>
											<div>
												<Input
													label={
														<span>
															Số điện thoại <span style={{color: 'red'}}>*</span>
														</span>
													}
													placeholder='Nhập số điện thoại'
													type='text'
													name='customer_phone'
													isRequired
													isPhone
													isNumber
													isBlur
												/>
											</div>
										</GridColumn>

										<Input
											label={
												<span>
													Địa chỉ giao hàng <span style={{color: 'red'}}>*</span>
												</span>
											}
											placeholder='Ví dụ: Số 20 Hồ Tùng Mậu, Phường Mai Dịch, Quận Cầu Giấy, Hà Nội'
											type='text'
											name='shipping_address'
											isRequired
											isBlur
										/>

										<TextArea
											label='Ghi chú'
											placeholder='Nhập ghi chú thêm (thời gian nhận hàng, lưu ý giao hàng...)'
											name='customer_note'
										/>
									</FlexLayout>
								</div>

								<div className={styles.order}>
									<h4>Đơn hàng của bạn</h4>
									<div className={styles.line} />

									<div className={styles.order_list}>
										{carts.map((order) => (
											<ProductOrder key={order.product._id} order={order} />
										))}
									</div>

									<div className={styles.line} />

									<div className={styles.summary_row}>
										<span>Số loại sản phẩm</span>
										<strong>{carts.length} sản phẩm</strong>
									</div>
									<div className={styles.summary_row}>
										<span>Tổng số lượng</span>
										<strong>{totalQuantity}</strong>
									</div>

									<div className={styles.line} />

									<div className={styles.total_row}>
										<p>Tổng cộng</p>
										<h5>{convertCoin(totalPrice)}₫</h5>
									</div>

									<div className={styles.submit_wrap}>
										<ContextForm.Consumer>
											{({isDone}) => (
												<Button
													disable={!isDone || carts.length === 0}
													icon={<TickCircle size='20' color='#fff' variant='Bold' />}
													bright-cyan
													bold
													rounded_8
													p_12_24
												>
													Xác nhận đặt hàng
												</Button>
											)}
										</ContextForm.Consumer>
									</div>

									<p className={styles.hotline_note}>
										Cần hỗ trợ nhanh? Hotline: <a href={`tel:${phoneNumber}`}>{formattedPhone}</a>
									</p>
								</div>
							</div>
						</Form>
					) : (
						!openOrderSuccess && (
							<div className={styles.empty}>
								<div className={styles.icon_empty}>
									<BsCartXFill size={40} color='#d92d20' />
								</div>
								<h4>Chưa có sản phẩm nào trong giỏ hàng!</h4>
								<p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành đặt mua hàng tại Văn phòng phẩm Huyền Anh.</p>
								<div className={styles.empty_btn}>
									<Button
										icon={<ArrowLeft size='18' color='#fff' />}
										bright-cyan
										bold
										rounded_24
										p_10_24
										href={PATH.Product}
									>
										Quay lại cửa hàng
									</Button>
								</div>
							</div>
						)
					)}
				</LayoutGrid>
			</div>

			<Popup open={openOrderSuccess} onClose={() => setOpenOrderSuccess(false)}>
				<OrderSuccess order={createdOrder} onClose={() => setOpenOrderSuccess(false)} />
			</Popup>
		</Fragment>
	);
}

export default MainOrder;
