'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {SearchNormal1, Flash} from 'iconsax-react';

import LayoutGrid from '~/components/layout/LayoutGrid';
import images from '~/constants/images/images';
import {PATH} from '~/constants/config';
import styles from './BannerHome.module.scss';
import type {PropsBannerHome} from './interfaces';

const POPULAR_TAGS = [
	{label: 'Bút bi', keyword: 'Bút bi'},
	{label: 'Bút chì', keyword: 'Bút chì'},
	{label: 'Giấy in A4', keyword: 'Giấy in'},
	{label: 'Kéo', keyword: 'Kéo'},
	{label: 'Vở vẽ', keyword: 'Vở vẽ'},
	{label: 'Bìa còng', keyword: 'Bìa'},
	{label: 'Ví bút', keyword: 'Ví bút'},
];

function BannerHome({}: PropsBannerHome) {
	const router = useRouter();
	const [keyword, setKeyword] = useState<string>('');

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (keyword.trim()) {
			router.push(`${PATH.Product}?_keyword=${encodeURIComponent(keyword.trim())}`);
		}
	};

	return (
		<LayoutGrid>
			<section className={styles.main_banner}>
				{/* Hero banner image container */}
				<div className={styles.image_banner}>
					<Image
						src={images.slider1}
						alt='Văn phòng phẩm Huyền Anh - Phân phối sỉ lẻ giá tốt'
						fill
						priority
						className={styles.banner_img}
						sizes='(max-width: 768px) 100vw, 1200px'
					/>

					{/* Banner overlay with quick search bar on large screens */}
					<div className={styles.banner_overlay}>
						<div className={styles.overlay_content}>
							<h1 className={styles.hero_title}>Văn Phòng Phẩm Huyền Anh</h1>
							<p className={styles.hero_subtitle}>
								Chuyên cung cấp đồ dùng học tập, văn phòng phẩm & quà lưu niệm chính hãng
							</p>

							{/* Quick search form */}
							<form onSubmit={handleSearch} className={styles.quick_search_box}>
								<SearchNormal1 size='20' color='#00b7c4' />
								<input
									type='text'
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									placeholder='Nhập tên sản phẩm, mã bút, giấy in cần tìm...'
									className={styles.search_input}
								/>
								<button type='submit' className={styles.btn_search_submit}>
									Tìm kiếm
								</button>
							</form>
						</div>
					</div>
				</div>

				{/* Quick search bar on mobile */}
				<form onSubmit={handleSearch} className={styles.mobile_search_box}>
					<SearchNormal1 size='18' color='#00b7c4' />
					<input
						type='text'
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						placeholder='Tìm bút viết, giấy in, sổ vở...'
						className={styles.search_input}
					/>
					<button type='submit' className={styles.btn_search_submit}>
						Tìm
					</button>
				</form>

				{/* Quick keyword pills below banner */}
				<div className={styles.popular_tags_row}>
					<div className={styles.tag_title}>
						<Flash size='16' color='#ea580c' variant='Bold' />
						<span>Tìm kiếm nhanh:</span>
					</div>
					<div className={styles.tags_list}>
						{POPULAR_TAGS.map((tag, idx) => (
							<Link
								key={idx}
								href={`${PATH.Product}?_keyword=${encodeURIComponent(tag.keyword)}`}
								className={styles.tag_item}
							>
								{tag.label}
							</Link>
						))}
					</div>
				</div>
			</section>
		</LayoutGrid>
	);
}

export default BannerHome;
