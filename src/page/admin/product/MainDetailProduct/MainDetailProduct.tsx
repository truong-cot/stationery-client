'use client';

import {useMutation, useQuery} from '@tanstack/react-query';
import {Warning2} from 'iconsax-react';
import {useParams, useRouter} from 'next/navigation';
import {Fragment, useState} from 'react';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import GridColumn from '~/components/layout/GridColumn';
import Breadcrumb from '~/components/utils/Breadcrumb';
import HeaderActions from '~/components/utils/HeaderActions';
import InfoDetail from '~/components/utils/InfoDetail';
import WrapperForm from '~/components/utils/WrapperForm';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {convertCoin} from '~/funcs/convertCoin';
import {httpRequest} from '~/funcs/httpRequest';
import productServices from '~/services/product.service';
import type {IDetailProduct, PropsMainDetailProduct} from './interfaces';

function MainDetailProduct({}: PropsMainDetailProduct) {
	const router = useRouter();
	const params = useParams();

	const {_id} = params;

	const [openDelete, setOpenDelete] = useState<boolean>(false);

	const {data: product} = useQuery<IDetailProduct>({
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
			router.back();
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteProduct.isPending} />
			<FlexLayout column gap-12>
				<HeaderActions title='Chỉnh sửa sản phẩm' />
				<Breadcrumb
					listUrls={[
						{
							title: 'Danh sách sản phẩm',
							path: PATH.AdminProduct,
						},
						{
							path: '',
							title: `Chi tiết sản phẩm: ${product?.name}`,
						},
					]}
					actions={
						<FlexLayout row gap-6 wrap fit-height>
							<div>
								<Button p_8_24 rounded_8 red bold onClick={() => setOpenDelete(true)}>
									Xóa sản phẩm
								</Button>
							</div>
							<div>
								<Button p_8_24 rounded_8 bright-cyan bold href={`${PATH.AdminUpdateProduct}?_id=${_id}`}>
									Chỉnh sửa sản phẩm
								</Button>
							</div>
							<div>
								<Button p_8_24 rounded_8 white bold onClick={() => router.back()}>
									Quay lại
								</Button>
							</div>
						</FlexLayout>
					}
				/>

				<FlexItem flex-1 overflow-x>
					<FlexLayout column gap-12>
						<WrapperForm title='Thông tin sản phẩm'>
							<FlexLayout column gap-16>
								<GridColumn col_3>
									<InfoDetail name='Tên sản phẩm' value={product?.name} />
									<InfoDetail name='Kích thước đóng gói' value={product?.pack_size} />
									<InfoDetail name='Giá sản phẩm' value={convertCoin(product?.price || 0)} />
									<InfoDetail name='Danh mục' value={product?.category?.name} />
									<InfoDetail name='Màu sắc' value={product?.color?.name} />
									<InfoDetail name='Kích cỡ' value={product?.size?.name} />
									<InfoDetail name='Thương hiệu' value={product?.trademark?.name} />
									<InfoDetail name='Sản phẩm nổi bật' value={product?.is_featured ? 'Có' : 'Không'} />
								</GridColumn>
								<InfoDetail name='Mô tả ngắn' value={product?.short_description} />
								<InfoDetail name='Ảnh sản phẩm' value='' images={product?.images} />
							</FlexLayout>
						</WrapperForm>
					</FlexLayout>
				</FlexItem>
			</FlexLayout>

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
