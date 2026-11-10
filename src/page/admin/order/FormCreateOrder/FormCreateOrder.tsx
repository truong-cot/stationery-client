'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import clsx from 'clsx';
import {Trash} from 'iconsax-reactjs';
import Image from 'next/image';
import {Fragment, useMemo, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, Select, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import GridColumn from '~/components/layout/GridColumn';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {toastWarn} from '~/funcs/toast';
import orderServices from '~/services/order.service';
import productServices from '~/services/product.service';
import type {ISelectedProductItem, PropsFormCreateOrder} from './interfaces';
import styles from './FormCreateOrder.module.scss';

interface IFormCreateOrder {
	customer_name: string;
	customer_phone: string;
	shipping_address: string;
	customer_note: string;
}

const initForm: IFormCreateOrder = {
	customer_name: '',
	customer_phone: '',
	shipping_address: '',
	customer_note: '',
};

function FormCreateOrder({onClose}: PropsFormCreateOrder) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreateOrder>(initForm);
	const [selectedItems, setSelectedItems] = useState<ISelectedProductItem[]>([]);
	const [selectedProductId, setSelectedProductId] = useState<string>('');

	// Danh sách sản phẩm cho component Select
	const {data: productsData} = useQuery<{
		items: {
			_id: string;
			name: string;
			price: number;
			pack_size: string;
			images: string[];
		}[];
	}>({
		queryKey: [QUERY_KEY.pageListProduct, 'order-create-drawer'],
		queryFn: () =>
			httpRequest({
				http: productServices.getPageList({
					page: 1,
					pageSize: 100,
					keyword: '',
				}),
			}),
	});

	const productList = productsData?.items || [];

	const handleAddProduct = (product: {_id: string; name: string; price: number; pack_size: string; images: string[]}) => {
		if (!product?._id) return;

		setSelectedItems((prev) => {
			const existingIndex = prev.findIndex((item) => item.product_id === product._id);
			if (existingIndex > -1) {
				const next = [...prev];
				next[existingIndex] = {
					...next[existingIndex],
					quantity: next[existingIndex].quantity + 1,
				};
				return next;
			}

			return [
				...prev,
				{
					product_id: product._id,
					name: product.name,
					pack_size: product.pack_size,
					price: product.price,
					image: product.images?.[0] || '',
					quantity: 1,
				},
			];
		});

		setSelectedProductId('');
	};

	const handleUpdateQuantity = (productId: string, quantity: number) => {
		if (quantity < 1) return;
		setSelectedItems((prev) => prev.map((item) => (item.product_id === productId ? {...item, quantity} : item)));
	};

	const handleRemoveItem = (productId: string) => {
		setSelectedItems((prev) => prev.filter((item) => item.product_id !== productId));
	};

	const totalAmount = useMemo(() => {
		return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}, [selectedItems]);

	const totalQuantity = useMemo(() => {
		return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
	}, [selectedItems]);

	const funcCreateOrder = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tạo đơn hàng thành công! Đơn hàng được chuyển sang COMPLETED.',
				http: orderServices.create({
					customer_name: form.customer_name,
					customer_phone: form.customer_phone,
					shipping_address: form.shipping_address,
					customer_note: form.customer_note || undefined,
					items: selectedItems.map((item) => ({
						product_id: item.product_id,
						quantity: item.quantity,
					})),
				}),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListOrder]});
			setForm(initForm);
			setSelectedItems([]);
			onClose();
		},
	});

	const handleSubmit = () => {
		if (selectedItems.length === 0) {
			toastWarn({msg: 'Vui lòng chọn ít nhất 1 sản phẩm cho đơn hàng!'});
			return;
		}

		funcCreateOrder.mutate();
	};

	const getImageUrl = (image: string) => {
		if (!image) return '';
		if (image.startsWith('http://') || image.startsWith('https://')) return image;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${image}`;
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcCreateOrder.isPending} />
			<WrapperFormPostion
				width={760}
				title='Tạo đơn hàng tại quầy / Đặt hộ'
				actions={
					<FlexLayout row items-center fit-height gap-8 wrap>
						<div>
							<Button p_8_24 rounded_8 white bold div onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<ContextForm.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone || selectedItems.length === 0} p_8_24 rounded_8 bright-cyan bold d_block>
										Tạo đơn hàng
									</Button>
								</div>
							)}
						</ContextForm.Consumer>
					</FlexLayout>
				}
			>
				<FlexLayout column gap-16>
					{/* Thông tin khách hàng */}
					<WrapperForm title='Thông tin khách hàng & Giao nhận'>
						<FlexLayout column gap-16>
							<GridColumn col_2>
								<Input
									label={
										<span>
											Họ và tên người nhận <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập tên người nhận hàng'
									name='customer_name'
									type='text'
									isRequired
								/>
								<div>
									<Input
										label={
											<span>
												Số điện thoại người nhận <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập số điện thoại (10 số)'
										name='customer_phone'
										type='text'
										isPhone
										isRequired
									/>
								</div>
							</GridColumn>
							<Input
								label={
									<span>
										Địa chỉ nhận hàng <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập địa chỉ nhận hàng chi tiết'
								name='shipping_address'
								type='text'
								isRequired
							/>
							<TextArea
								label='Ghi chú của khách hàng'
								placeholder='Ví dụ: Giao giờ hành chính, gọi trước khi giao...'
								name='customer_note'
							/>
						</FlexLayout>
					</WrapperForm>

					{/* Danh sách sản phẩm mua sử dụng component Select */}
					<WrapperForm title='Danh sách sản phẩm mua'>
						<Select<{
							_id: string;
							name: string;
							price: number;
							pack_size: string;
							images: string[];
						}>
							label='Chọn sản phẩm thêm vào đơn hàng'
							placeholder='Tìm kiếm và chọn sản phẩm...'
							value={selectedProductId}
							options={productList}
							onSelect={(product) => handleAddProduct(product)}
							getOptionLabel={(p) => `${p.name}${p.pack_size ? ` (${p.pack_size})` : ''} - ${convertCoin(p.price)}đ`}
							getOptionValue={(p) => p._id}
						/>

						{selectedItems.length > 0 ? (
							<table className={styles.tableItems}>
								<thead>
									<tr>
										<th style={{width: 40, textAlign: 'center'}}>STT</th>
										<th>Sản phẩm</th>
										<th style={{textAlign: 'right'}}>Đơn giá</th>
										<th style={{width: 120, textAlign: 'center'}}>Số lượng</th>
										<th style={{textAlign: 'right'}}>Thành tiền</th>
										<th style={{width: 50, textAlign: 'center'}}>Xóa</th>
									</tr>
								</thead>
								<tbody>
									{selectedItems.map((item, index) => {
										const imgUrl = getImageUrl(item.image);
										return (
											<tr key={item.product_id}>
												<td style={{textAlign: 'center'}}>{index + 1}</td>
												<td>
													<div className={styles.productCell}>
														<div className={styles.imageWrapper}>
															{imgUrl ? (
																<Image unoptimized src={imgUrl} alt={item.name} width={40} height={40} />
															) : (
																<span style={{fontSize: 9, color: '#94a3b8'}}>No img</span>
															)}
														</div>
														<div className={styles.productInfo}>
															<span className={styles.productName}>{item.name}</span>
															{item.pack_size && <span className={styles.packSize}>{item.pack_size}</span>}
														</div>
													</div>
												</td>
												<td style={{textAlign: 'right', fontWeight: 600}}>{convertCoin(item.price)}đ</td>
												<td style={{textAlign: 'center'}}>
													<div className={styles.quantityControl} style={{margin: '0 auto'}}>
														<button
															type='button'
															onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
															disabled={item.quantity <= 1}
														>
															-
														</button>
														<input
															type='number'
															min={1}
															value={item.quantity}
															onChange={(e) => {
																const val = parseInt(e.target.value, 10);
																handleUpdateQuantity(item.product_id, isNaN(val) || val < 1 ? 1 : val);
															}}
														/>
														<button
															type='button'
															onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
														>
															+
														</button>
													</div>
												</td>
												<td style={{textAlign: 'right', fontWeight: 700, color: '#0f172a'}}>
													{convertCoin(item.price * item.quantity)}đ
												</td>
												<td style={{textAlign: 'center'}}>
													<button
														type='button'
														onClick={() => handleRemoveItem(item.product_id)}
														style={{
															background: 'none',
															border: 'none',
															cursor: 'pointer',
															color: '#ef4444',
															display: 'inline-flex',
															alignItems: 'center',
														}}
														title='Xóa khỏi đơn'
													>
														<Trash size={18} />
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						) : (
							<div className={styles.emptyItems}>
								Chưa có sản phẩm nào được chọn. Hãy chọn sản phẩm ở ô tìm kiếm bên trên!
							</div>
						)}

						<div className={styles.summaryCard}>
							<div className={styles.summaryRow}>
								<span>Số lượng mặt hàng:</span>
								<strong>{selectedItems.length} mặt hàng</strong>
							</div>
							<div className={styles.summaryRow}>
								<span>Tổng số lượng sản phẩm:</span>
								<strong>{totalQuantity} chiếc/hộp</strong>
							</div>
							<div className={clsx(styles.summaryRow, styles.total)}>
								<span>Tổng tiền thanh toán (tạm tính):</span>
								<span className={styles.totalPrice}>{convertCoin(totalAmount)}đ</span>
							</div>
						</div>

						<div className={styles.noticeAutoCompleted}>
							ℹ️ Đơn hàng tạo trực tiếp từ Admin sẽ tự động ở trạng thái <strong>COMPLETED (Đã xác nhận)</strong>.
						</div>
					</WrapperForm>
				</FlexLayout>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormCreateOrder;
