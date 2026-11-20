'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import clsx from 'clsx';
import {Trash, Warning2} from 'iconsax-reactjs';
import Image from 'next/image';
import {Fragment, useEffect, useMemo, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import Form, {ContextForm, Input, Select, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import GridColumn from '~/components/layout/GridColumn';
import StateActive from '~/components/utils/StateActive';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {listStateOrder, ORDER_STATUS} from '~/constants/config/order';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import {toastWarn} from '~/funcs/toast';
import orderServices from '~/services/order.service';
import productServices from '~/services/product.service';
import type {IOrderDetail} from '../DetailOrder/interfaces';
import type {ISelectedProductItem, PropsFormUpdateOrder} from './interfaces';
import styles from './FormUpdateOrder.module.scss';

interface IFormUpdateOrder {
	customer_name: string;
	customer_phone: string;
	shipping_address: string;
	customer_note: string;
}

const initForm: IFormUpdateOrder = {
	customer_name: '',
	customer_phone: '',
	shipping_address: '',
	customer_note: '',
};

interface IProductOption {
	_id: string;
	name: string;
	price: number;
	pack_size: string;
	images: string[];
	classifies?: {
		_id: string;
		name: string;
	}[];
}

function FormUpdateOrder({_idOrder, onClose}: PropsFormUpdateOrder) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateOrder>(initForm);
	const [selectedItems, setSelectedItems] = useState<ISelectedProductItem[]>([]);
	const [selectedProductId, setSelectedProductId] = useState<string>('');
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

	// Quản lý modal chọn phân loại khi sản phẩm có phân loại
	const [pendingProduct, setPendingProduct] = useState<IProductOption | null>(null);
	const [selectedClassifyInModal, setSelectedClassifyInModal] = useState<{_id: string; name: string} | null>(null);

	// Lấy chi tiết đơn hàng
	const {data: order, isLoading: isOrderLoading} = useQuery<IOrderDetail>({
		queryKey: [QUERY_KEY.detailOrder, _idOrder],
		queryFn: () =>
			httpRequest({
				http: orderServices.detail({
					_id: _idOrder,
				}),
			}),
		enabled: !!_idOrder,
		staleTime: 0,
	});

	// Danh sách sản phẩm cho component Select từ API catalog-product
	const {data: productsData} = useQuery<IProductOption[] | {items: IProductOption[]}>({
		queryKey: [QUERY_KEY.catalogProduct],
		queryFn: () =>
			httpRequest({
				http: productServices.catalogProduct(),
			}),
		staleTime: 5 * 60 * 1000,
	});

	const productList: IProductOption[] = Array.isArray(productsData)
		? productsData
		: (productsData as any)?.items || [];

	useEffect(() => {
		if (order && !isDataLoaded) {
			setForm({
				customer_name: order.customer_name || '',
				customer_phone: order.customer_phone || '',
				shipping_address: order.shipping_address || '',
				customer_note: order.customer_note || '',
			});

			if (order.items && order.items.length > 0) {
				setSelectedItems(
					order.items.map((i) => ({
						cartItemId: `${i.product_id}_${i.classify_id || 'default'}`,
						product_id: i.product_id,
						classify_id: i.classify_id || null,
						classify_name: i.classify_name || null,
						name: i.product_name,
						pack_size: i.pack_size,
						price: i.price,
						image: i.product_image,
						quantity: i.quantity,
					}))
				);
			}

			setIsDataLoaded(true);
		}
	}, [order, isDataLoaded]);

	const addProductToOrder = (product: IProductOption, classify: {_id: string; name: string} | null) => {
		const cartItemId = `${product._id}_${classify ? classify._id : 'default'}`;

		setSelectedItems((prev) => {
			const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
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
					cartItemId,
					product_id: product._id,
					classify_id: classify ? classify._id : null,
					classify_name: classify ? classify.name : null,
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

	const handleSelectProduct = (product: IProductOption) => {
		if (!product?._id) return;

		if (product.classifies && product.classifies.length > 0) {
			setPendingProduct(product);
			setSelectedClassifyInModal(product.classifies[0]);
		} else {
			addProductToOrder(product, null);
		}
	};

	const handleConfirmClassify = () => {
		if (pendingProduct && selectedClassifyInModal) {
			addProductToOrder(pendingProduct, selectedClassifyInModal);
			setPendingProduct(null);
			setSelectedClassifyInModal(null);
		}
	};

	const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
		if (quantity < 1) return;
		setSelectedItems((prev) => prev.map((item) => (item.cartItemId === cartItemId ? {...item, quantity} : item)));
	};

	const handleRemoveItem = (cartItemId: string) => {
		setSelectedItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
	};

	const totalAmount = useMemo(() => {
		return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}, [selectedItems]);

	const totalQuantity = useMemo(() => {
		return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
	}, [selectedItems]);

	const isPending = order?.order_status === ORDER_STATUS.PENDING;

	const funcUpdateOrder = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật đơn hàng thành công!',
				http: orderServices.update({
					_id: _idOrder,
					customer_name: form.customer_name.trim(),
					customer_phone: form.customer_phone.trim(),
					shipping_address: form.shipping_address.trim(),
					customer_note: form.customer_note.trim() || undefined,
					items: selectedItems.map((item) => ({
						product_id: item.product_id,
						classify_id: item.classify_id || null,
						quantity: item.quantity,
					})),
				}),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.detailOrder, _idOrder]});
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListOrder]});
			onClose();
		},
	});

	const handleSubmit = () => {
		if (!isPending) {
			toastWarn({msg: 'Chỉ được phép chỉnh sửa đơn hàng ở trạng thái PENDING!'});
			return;
		}

		if (selectedItems.length === 0) {
			toastWarn({msg: 'Vui lòng chọn ít nhất 1 sản phẩm cho đơn hàng!'});
			return;
		}

		funcUpdateOrder.mutate();
	};

	const getImageUrl = (image: string) => {
		if (!image) return '';
		if (image.startsWith('http://') || image.startsWith('https://')) return image;
		return `${process.env.NEXT_PUBLIC_IMAGE}/${image}`;
	};

	return (
		<Fragment>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Loading loading={isOrderLoading || funcUpdateOrder.isPending} />
				<WrapperFormPostion
					width={780}
					title={`Chỉnh sửa đơn hàng - ${order?.code || '---'}`}
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
										<Button
											disable={!isDone || selectedItems.length === 0 || !isPending}
											p_8_24
											rounded_8
											bright-cyan
											bold
											d_block
										>
											Lưu thay đổi
										</Button>
									</div>
								)}
							</ContextForm.Consumer>
						</FlexLayout>
					}
				>
					<FlexLayout column gap-16>
						{!isPending && (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									padding: '10px 14px',
									background: '#fef2f2',
									border: '1px solid #fecaca',
									borderRadius: 8,
									color: '#dc2626',
									fontSize: 13,
								}}
							>
								<Warning2 size={18} />
								<span>
									Đơn hàng hiện ở trạng thái{' '}
									<strong>
										<StateActive stateActive={order?.order_status || null} listState={listStateOrder} />
									</strong>
									. Theo quy định, chỉ đơn hàng <strong>PENDING</strong> mới có thể chỉnh sửa!
								</span>
							</div>
						)}

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
							<Select<IProductOption>
								label='Thêm sản phẩm vào đơn hàng'
								placeholder='Tìm kiếm và chọn sản phẩm...'
								value={selectedProductId}
								options={productList}
								onSelect={(product) => handleSelectProduct(product)}
								getOptionLabel={(p) =>
									`${p.name}${p.pack_size ? ` (${p.pack_size})` : ''}${
										p.classifies && p.classifies.length > 0 ? ` [${p.classifies.length} phân loại]` : ''
									} - ${convertCoin(p.price)}đ`
								}
								getOptionValue={(p) => p._id}
							/>

							{selectedItems.length > 0 ? (
								<table className={styles.tableItems}>
									<thead>
										<tr>
											<th style={{width: 40, textAlign: 'center'}}>STT</th>
											<th>Sản phẩm</th>
											<th style={{textAlign: 'center'}}>Phân loại</th>
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
												<tr key={item.cartItemId}>
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
													<td style={{textAlign: 'center'}}>
														{item.classify_name ? (
															<span className={styles.badgeClassify}>{item.classify_name}</span>
														) : (
															<span className={styles.badgeStandard}>Tiêu chuẩn</span>
														)}
													</td>
													<td style={{textAlign: 'right', fontWeight: 600}}>{convertCoin(item.price)}đ</td>
													<td style={{textAlign: 'center'}}>
														<div className={styles.quantityControl} style={{margin: '0 auto'}}>
															<button
																type='button'
																onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
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
																	handleUpdateQuantity(item.cartItemId, isNaN(val) || val < 1 ? 1 : val);
																}}
															/>
															<button
																type='button'
																onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
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
															onClick={() => handleRemoveItem(item.cartItemId)}
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
						</WrapperForm>
					</FlexLayout>
				</WrapperFormPostion>
			</Form>

			{/* Dialog chọn phân loại cho sản phẩm */}
			<Dialog
				open={Boolean(pendingProduct)}
				onClose={() => setPendingProduct(null)}
				onSubmit={handleConfirmClassify}
				title='Chọn phân loại hàng'
				note={`Sản phẩm "${pendingProduct?.name}" có nhiều phân loại. Vui lòng chọn 1 phân loại để thêm vào đơn:`}
				titleSubmit='Xác nhận thêm'
				titleCancel='Hủy bỏ'
				form={
					<div className={styles.classifyDialogBody}>
						<div className={styles.classifyOptionList}>
							{pendingProduct?.classifies?.map((c) => {
								const isSelected = selectedClassifyInModal?._id === c._id;
								return (
									<button
										key={c._id}
										type='button'
										className={clsx(styles.classifyOptionBtn, {[styles.active]: isSelected})}
										onClick={() => setSelectedClassifyInModal(c)}
									>
										{c.name}
									</button>
								);
							})}
						</div>
					</div>
				}
			/>
		</Fragment>
	);
}

export default FormUpdateOrder;
