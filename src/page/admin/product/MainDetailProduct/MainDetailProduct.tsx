'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Warning2} from 'iconsax-react';
import {useParams, useRouter} from 'next/navigation';
import {Fragment, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import GridColumn from '~/components/layout/GridColumn';
import InfoDetail from '~/components/utils/InfoDetail';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import productServices from '~/services/product.service';
import type {IDetailProduct, PropsMainDetailProduct} from './interfaces';
import TagRefItem from '~/components/utils/TagRefItem';

function MainDetailProduct({_idProduct, onClose, onEdit}: PropsMainDetailProduct) {
	const router = useRouter();
	const params = useParams();
	const queryClient = useQueryClient();

	const _id = _idProduct || (params?._id as string);

	const [openDelete, setOpenDelete] = useState<boolean>(false);

	const {data: product, isLoading} = useQuery<IDetailProduct>({
		queryKey: [QUERY_KEY.detailProduct, _id],
		queryFn: () =>
			httpRequest({
				http: productServices.detail({
					_id: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_id,
	});

	const funcDeleteProduct = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa sản phẩm thành công!',
				http: productServices.delete({
					_id: _id as string,
				}),
			}),
		onSuccess: () => {
			setOpenDelete(false);
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListProduct]});
			if (onClose) {
				onClose();
			} else {
				router.back();
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={isLoading || funcDeleteProduct.isPending} />
			<WrapperFormPostion
				width={780}
				title={`Chi tiết sản phẩm: ${product?.name || '---'}`}
				actions={
					<FlexLayout row items-center fit-height gap-8 wrap>
						<div>
							<Button p_8_24 rounded_8 red bold onClick={() => setOpenDelete(true)}>
								Xóa sản phẩm
							</Button>
						</div>
						<div>
							<Button
								p_8_24
								rounded_8
								bright-cyan
								bold
								onClick={onEdit || (() => router.push(`${PATH.AdminUpdateProduct}?_id=${_id}`))}
							>
								Chỉnh sửa sản phẩm
							</Button>
						</div>
						<div>
							<Button p_8_24 rounded_8 white bold onClick={onClose || (() => router.back())}>
								Đóng
							</Button>
						</div>
					</FlexLayout>
				}
			>
				<WrapperForm title='Thông tin sản phẩm'>
					<FlexLayout column gap-16>
						<GridColumn col_3>
							<InfoDetail name='Tên sản phẩm' value={product?.name} />
							<InfoDetail name='Kích thước đóng gói' value={product?.pack_size} />
							<InfoDetail name='Giá sản phẩm' value={convertCoin(product?.price || 0)} />
							<InfoDetail name='Danh mục' value={product?.category?.name} />
							<InfoDetail
								name='Phân loại'
								value=''
								actions={
									(() => {
										const list =
											product?.classifies && product.classifies.length > 0
												? product.classifies
												: product?.colors;
										return list && list.length > 0 ? (
											<FlexLayout row gap-4 wrap>
												{list.map((c) => (
													<TagRefItem key={c._id} name={c.name} />
												))}
											</FlexLayout>
										) : (
											'---'
										);
									})()
								}
							/>
							<InfoDetail name='Kích cỡ' value={product?.size?.name} />
							<InfoDetail name='Thương hiệu' value={product?.trademark?.name} />
							<InfoDetail name='Sản phẩm nổi bật' value={product?.is_featured ? 'Có' : 'Không'} />
						</GridColumn>
						<InfoDetail name='Mô tả ngắn' value={product?.short_description} />
						<InfoDetail name='Ảnh sản phẩm' value='' images={product?.images} />
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>

			<Dialog
				open={openDelete}
				type='error'
				backgroundIconColor='#ffdce4'
				borderIconColor='#fff0f3'
				title='Xóa sản phẩm'
				note='Bạn có chắc chắn muốn xóa sản phẩm này không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				onClose={() => setOpenDelete(false)}
				onSubmit={funcDeleteProduct.mutate}
			/>
		</Fragment>
	);
}

export default MainDetailProduct;
