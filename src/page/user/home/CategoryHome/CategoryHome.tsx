'use client';

import LayoutGrid from '~/components/layout/LayoutGrid';
import styles from './CategoryHome.module.scss';
import type {PropsCategoryHome} from './interfaces';
import {useQuery} from '@tanstack/react-query';
import {INodeCategory} from '../../product/MainProduct/components/FilterProduct/interfaces';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import clientServices from '~/services/client.service';
import NodeCategoryHome from '../NodeCategoryHome';
import {useMemo} from 'react';
import images from '~/constants/images/images';
import Slider from 'react-slick';
import Image from 'next/image';

function CategoryHome({}: PropsCategoryHome) {
	const sliders = useMemo(() => [images.slider1, images.slider3, images.slider2, images.slider4], []);

	const sliderSettings = useMemo(
		() => ({
			slidesToShow: 1,
			swipeToSlide: true,
			arrows: false,
			dots: true,
			autoplay: true,
			autoplaySpeed: 3000,
			speed: 800,
			pauseOnHover: true,
			pauseOnFocus: true,
			adaptiveHeight: true,
			appendDots: (dots: React.ReactNode) => (
				<div className={styles.custom_dots}>
					<ul>{dots}</ul>
				</div>
			),
			customPaging: () => (
				<button className={styles.dot}>
					<span />
				</button>
			),
		}),
		[]
	);

	const {data: nodes = []} = useQuery<INodeCategory[]>({
		queryKey: [QUERY_KEY.clientTreeCategory],
		queryFn: () =>
			httpRequest({
				http: clientServices.treeCategory(),
			}),
	});

	return (
		<LayoutGrid>
			<section className={styles.category_home}>
				<div className={styles.head}>
					<h4>Danh mục sản phẩm</h4>
				</div>
				<div className={styles.main}>
					<div className={styles.category}>
						{nodes?.map((node) => (
							<NodeCategoryHome key={node._id} level={0} node={node} />
						))}
					</div>
					<div className={styles.slider}>
						<Slider {...sliderSettings}>
							{sliders.map((image, idx) => (
								<div key={idx} className={styles.image}>
									<Image
										src={image}
										alt={`Ảnh banner ${idx + 1}`}
										fill
										style={{objectFit: 'cover'}}
										priority={idx === 0}
									/>
								</div>
							))}
						</Slider>
					</div>
				</div>
			</section>
		</LayoutGrid>
	);
}

export default CategoryHome;
