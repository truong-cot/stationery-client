'use client';

import {useState} from 'react';
import {useParams} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {
	BagHappy,
	DocumentText1,
	ShieldSecurity,
	Box,
	TruckFast,
	Category2,
	TriangleLogo,
	Size,
	Colorfilter,
	Verify,
} from 'iconsax-react';

import LayoutGrid from '~/components/layout/LayoutGrid';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import DataWrapper from '~/components/utils/DataWrapper';
import GridColumn from '~/components/layout/GridColumn';
import CardProduct from '../CardProduct';
import SkeletonCardProduct from '~/components/common/SkeletonCardProduct';
import {IProductClient} from '../MainProduct/components/ListProduct/interfaces';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import styles from './MainDetailProduct.module.scss';
import type {PropsMainDetailProduct} from './interfaces';

type TabType = 'specs' | 'desc' | 'policy';

function MainDetailProduct({product}: PropsMainDetailProduct) {
	const params = useParams();
	const {_id} = params;
	const [activeTab, setActiveTab] = useState<TabType>('specs');

	const {data: products = [], isLoading} = useQuery<IProductClient[]>({
		queryKey: [QUERY_KEY.clientProductSimilar, _id],
		queryFn: () =>
			httpRequest({
				http: clientServices.productSimilar({product_id: _id as string}),
			}),
		enabled: !!_id,
	});

	const colorList =
		product?.colors && product.colors.length > 0
			? product.colors.map((c) => c.name).join(', ')
			: product?.color?.name || '';

	return (
		<LayoutGrid>
			{/* Breadcrumb Navigation */}
			<nav aria-label='Đường dẫn phân cấp' className={styles.head}>
				<div className={styles.breadcrumb_wrapper}>
					<Breadcrumb
						isPadding={false}
						listUrls={[
							{path: PATH.Home, title: 'Trang chủ'},
							...(product?.tree_category?.map((cat) => ({
								path: `${PATH.Product}?_categoryId=${cat._id}`,
								title: cat.name,
							})) || []),
							{path: '', title: product?.name},
						]}
					/>
				</div>
			</nav>

			{/* Main Product Showcase (Images + Info) */}
			<div className={styles.main}>
				<div className={styles.col_images}>
					<ProductImages images={product?.images} />
				</div>
				<div className={styles.col_info}>
					<ProductInfo product={product} />
				</div>
			</div>

			{/* Detailed Tabs Section */}
			<section className={styles.tabs_section}>
				<div className={styles.tab_headers}>
					<button
						type='button'
						className={clsx(styles.tab_btn, {[styles.active]: activeTab === 'specs'})}
						onClick={() => setActiveTab('specs')}
					>
						<Box size='18' variant='Bold' />
						<span>Thông số chi tiết</span>
					</button>

					<button
						type='button'
						className={clsx(styles.tab_btn, {[styles.active]: activeTab === 'desc'})}
						onClick={() => setActiveTab('desc')}
					>
						<DocumentText1 size='18' variant='Bold' />
						<span>Mô tả & Công dụng</span>
					</button>

					<button
						type='button'
						className={clsx(styles.tab_btn, {[styles.active]: activeTab === 'policy'})}
						onClick={() => setActiveTab('policy')}
					>
						<ShieldSecurity size='18' variant='Bold' />
						<span>Chính sách & Giao nhận</span>
					</button>
				</div>

				<div className={styles.tab_content}>
					{activeTab === 'specs' && (
						<div className={styles.specs_pane}>
							<table className={styles.specs_table}>
								<tbody>
									<tr>
										<td className={styles.spec_title}>
											<Category2 size='16' color='#00b7c4' />
											<span>Tên sản phẩm</span>
										</td>
										<td className={styles.spec_data}>{product?.name}</td>
									</tr>
									<tr>
										<td className={styles.spec_title}>
											<Category2 size='16' color='#00b7c4' />
											<span>Danh mục</span>
										</td>
										<td className={styles.spec_data}>
											{product?.category?.name || 'Văn phòng phẩm'}
										</td>
									</tr>
									<tr>
										<td className={styles.spec_title}>
											<TriangleLogo size='16' color='#00b7c4' />
											<span>Thương hiệu</span>
										</td>
										<td className={styles.spec_data}>
											{product?.trademark?.name || 'Chính hãng'}
										</td>
									</tr>
									{product?.size?.name && (
										<tr>
											<td className={styles.spec_title}>
												<Size size='16' color='#00b7c4' />
												<span>Kích thước</span>
											</td>
											<td className={styles.spec_data}>{product.size.name}</td>
										</tr>
									)}
									{colorList && (
										<tr>
											<td className={styles.spec_title}>
												<Colorfilter size='16' color='#00b7c4' />
												<span>Màu sắc</span>
											</td>
											<td className={styles.spec_data}>{colorList}</td>
										</tr>
									)}
									{product?.pack_size && (
										<tr>
											<td className={styles.spec_title}>
												<Box size='16' color='#00b7c4' />
												<span>Quy cách đóng gói</span>
											</td>
											<td className={styles.spec_data}>{product.pack_size}</td>
										</tr>
									)}
									<tr>
										<td className={styles.spec_title}>
											<Verify size='16' color='#00b7c4' />
											<span>Tình trạng</span>
										</td>
										<td className={styles.spec_data}>
											Mới 100%, nguyên hộp chính hãng
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					)}

					{activeTab === 'desc' && (
						<div className={styles.desc_pane}>
							{product?.short_description ? (
								<p className={styles.desc_paragraph}>{product.short_description}</p>
							) : (
								<p className={styles.desc_paragraph}>
									Sản phẩm <strong>{product?.name}</strong> là đồ dùng văn phòng phẩm chuyên dụng chất lượng cao, phục vụ hiệu quả cho công việc văn phòng, học tập tại trường học và sinh hoạt hàng ngày. Sản phẩm được sản xuất từ chất liệu an toàn, bền bỉ và tiện lợi trong quá trình sử dụng.
								</p>
							)}
							<div className={styles.desc_highlights}>
								<h4>Đặc điểm nổi bật:</h4>
								<ul>
									<li>Chất lượng gia công chuẩn xác, độ bền cao, an toàn cho người dùng.</li>
									<li>Thiết kế thông minh, thân thiện và tiện lợi khi thao tác thường xuyên.</li>
									<li>Thích hợp cho nhu cầu trang bị văn phòng, lớp học, cơ quan và gia đình.</li>
									<li>Bảo quản nơi khô ráo, thoáng mát, tránh nhiệt độ cao hoặc nguồn lửa trực tiếp.</li>
								</ul>
							</div>
						</div>
					)}

					{activeTab === 'policy' && (
						<div className={styles.policy_pane}>
							<div className={styles.policy_card}>
								<div className={styles.policy_icon}>
									<TruckFast size='22' color='#00b7c4' variant='Bold' />
								</div>
								<div>
									<h4>Giao hàng & Vận chuyển</h4>
									<p>
										Giao hàng nhanh nội thành và toàn quốc. Hỗ trợ giao hỏa tốc cho các đơn hàng cấp thiết của cơ quan, trường học và công ty. Khách hàng được quyền kiểm tra hàng trước khi thanh toán.
									</p>
								</div>
							</div>

							<div className={styles.policy_card}>
								<div className={styles.policy_icon}>
									<Verify size='22' color='#10b981' variant='Bold' />
								</div>
								<div>
									<h4>Hỗ trợ xuất hóa đơn</h4>
									<p>
										Hỗ trợ xuất hóa đơn theo yêu cầu cho các cơ quan, trường học và doanh nghiệp. Áp dụng chính sách ưu đãi cho các đơn vị hợp tác cung ứng văn phòng phẩm thường xuyên.
									</p>
								</div>
							</div>

							<div className={styles.policy_card}>
								<div className={styles.policy_icon}>
									<ShieldSecurity size='22' color='#f59e0b' variant='Bold' />
								</div>
								<div>
									<h4>Đổi trả & Bảo hành</h4>
									<p>
										Cam kết 100% hàng chính hãng. Đổi mới miễn phí trong vòng 7 ngày nếu phát hiện sản phẩm có lỗi kỹ thuật hoặc hư hỏng từ khâu sản xuất và đóng gói.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Similar Products Section */}
			<section className={styles.similar_section}>
				<div className={styles.head_section}>
					<div className={styles.title_group}>
						<div className={styles.title_icon}>
							<BagHappy size='20' color='#00b7c4' variant='Bold' />
						</div>
						<div>
							<h2 className={styles.section_heading}>Sản phẩm tương tự</h2>
							<p className={styles.section_sub}>Các sản phẩm cùng loại bạn có thể quan tâm</p>
						</div>
					</div>
				</div>

				{isLoading ? (
					<GridColumn col_5>
						<SkeletonCardProduct count={5} />
					</GridColumn>
				) : (
					<DataWrapper
						data={products}
						loading={false}
						small={true}
						title=''
						note='Không tìm thấy sản phẩm tương tự cho sản phẩm này!'
					>
						<GridColumn col_5>
							{products?.map((item) => (
								<CardProduct key={item._id} product={item} />
							))}
						</GridColumn>
					</DataWrapper>
				)}
			</section>
		</LayoutGrid>
	);
}

export default MainDetailProduct;
