'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './CategoryIcon.module.scss';
import {
	FaPenFancy,
	FaPencilAlt,
	FaCut,
	FaBookOpen,
	FaFolderOpen,
	FaPalette,
	FaShapes,
	FaPaperclip,
	FaGift,
	FaWineBottle,
	FaEraser,
	FaChalkboard,
	FaBriefcase,
	FaHighlighter,
	FaTape,
	FaClipboardList,
	FaCalculator,
	FaRulerCombined,
	FaStamp,
	FaStoreAlt,
	FaThLarge,
} from 'react-icons/fa';

interface PropsCategoryIcon {
	name: string;
	image?: string | null;
	size?: number;
	className?: string;
}

export function getFallbackCategoryVisual(name: string): {icon: React.ReactNode; bg: string; color: string} {
	const lower = (name || '').toLowerCase().trim();

	// 0. Tất cả sản phẩm / Tất cả
	if (lower.includes('tất cả')) {
		return {icon: <FaThLarge />, bg: '#e0f2fe', color: '#0284c7'};
	}

	// 1. Văn phòng phẩm chung
	if (lower === 'văn phòng phẩm' || lower.startsWith('văn phòng')) {
		return {icon: <FaStoreAlt />, bg: '#e0f2fe', color: '#0284c7'};
	}

	// 2. Các loại bút
	if (
		lower.includes('bút bi') ||
		lower.includes('bút máy') ||
		lower.includes('bút mực') ||
		lower.includes('bút viết') ||
		lower.includes('bút gel')
	) {
		return {icon: <FaPenFancy />, bg: '#dbeafe', color: '#2563eb'};
	}
	if (lower.includes('bút chì')) {
		return {icon: <FaPencilAlt />, bg: '#fef3c7', color: '#d97706'};
	}
	if (lower.includes('bút xóa') || lower.includes('tẩy') || lower.includes('gôm')) {
		return {icon: <FaEraser />, bg: '#fee2e2', color: '#dc2626'};
	}
	if (
		lower.includes('bút dạ') ||
		lower.includes('bút lông') ||
		lower.includes('bút nhớ') ||
		lower.includes('highlighter')
	) {
		return {icon: <FaHighlighter />, bg: '#fef08a', color: '#ca8a04'};
	}

	// 3. Hộp bút, ví bút
	if (
		lower.includes('ví bút') ||
		lower.includes('hộp bút') ||
		lower.includes('bóp') ||
		lower.includes('túi bút')
	) {
		return {icon: <FaBriefcase />, bg: '#ede9fe', color: '#7c3aed'};
	}

	// 4. Giấy, bìa, in ấn
	if (
		lower.includes('giấy') ||
		lower.includes('bìa') ||
		lower.includes('decal') ||
		lower.includes('in')
	) {
		return {icon: <FaFolderOpen />, bg: '#dcfce7', color: '#16a34a'};
	}

	// 5. Cắt, dán, dao kéo, băng dính
	if (lower.includes('kéo') || lower.includes('dao') || lower.includes('rọc')) {
		return {icon: <FaCut />, bg: '#ffedd5', color: '#ea580c'};
	}
	if (
		lower.includes('băng') ||
		lower.includes('keo') ||
		lower.includes('dính') ||
		lower.includes('hồ') ||
		lower.includes('gạt')
	) {
		return {icon: <FaTape />, bg: '#fef3c7', color: '#b45309'};
	}

	// 6. Vở, sổ tay, giáo trình
	if (
		lower.includes('vở') ||
		lower.includes('sổ') ||
		lower.includes('tập') ||
		lower.includes('note')
	) {
		return {icon: <FaBookOpen />, bg: '#e0e7ff', color: '#4f46e5'};
	}

	// 7. Hội họa, màu vẽ, mỹ thuật
	if (
		lower.includes('vẽ') ||
		lower.includes('màu') ||
		lower.includes('sáp') ||
		lower.includes('cọ') ||
		lower.includes('toan')
	) {
		return {icon: <FaPalette />, bg: '#fce7f3', color: '#db2777'};
	}

	// 8. Trình ký, hồ sơ, lưu trữ
	if (
		lower.includes('trình ký') ||
		lower.includes('kẹp file') ||
		lower.includes('hồ sơ') ||
		lower.includes('file')
	) {
		return {icon: <FaClipboardList />, bg: '#ccfbf1', color: '#0d9488'};
	}

	// 9. Bảng viết, bảng gạt, phấn
	if (lower.includes('bảng') || lower.includes('phấn')) {
		return {icon: <FaChalkboard />, bg: '#f1f5f9', color: '#334155'};
	}

	// 10. Dụng cụ văn phòng: dập ghim, bấm kim, thước, máy tính
	if (
		lower.includes('dập ghim') ||
		lower.includes('bấm kim') ||
		lower.includes('đục lỗ')
	) {
		return {icon: <FaStamp />, bg: '#fae8ff', color: '#a21caf'};
	}
	if (
		lower.includes('thước') ||
		lower.includes('compa') ||
		lower.includes('ê ke')
	) {
		return {icon: <FaRulerCombined />, bg: '#e0f2fe', color: '#0369a1'};
	}
	if (lower.includes('máy tính') || lower.includes('casio')) {
		return {icon: <FaCalculator />, bg: '#f3e8ff', color: '#6b21a8'};
	}

	// 11. Đồ chơi, quà tặng, lưu niệm
	if (
		lower.includes('đồ chơi') ||
		lower.includes('lưu niệm') ||
		lower.includes('quà')
	) {
		return {icon: <FaGift />, bg: '#fae8ff', color: '#c026d3'};
	}

	// 12. Phụ kiện, kẹp tóc, nhíp, ghim
	if (
		lower.includes('phụ kiện') ||
		lower.includes('cặp tóc') ||
		lower.includes('nhíp') ||
		lower.includes('ghim') ||
		lower.includes('kẹp')
	) {
		return {icon: <FaPaperclip />, bg: '#fef9c3', color: '#ca8a04'};
	}

	// 13. Bình nước, bình giữ nhiệt
	if (
		lower.includes('bình nước') ||
		lower.includes('ly') ||
		lower.includes('cốc')
	) {
		return {icon: <FaWineBottle />, bg: '#e0f2fe', color: '#0284c7'};
	}

	return {icon: <FaShapes />, bg: '#f0fdfa', color: '#00b7c4'};
}

function CategoryIcon({name, size = 64, className}: PropsCategoryIcon) {
	const visual = getFallbackCategoryVisual(name);
	const borderRadius = size <= 32 ? '50%' : '10px';

	return (
		<div
			className={clsx(styles.icon_wrapper, className)}
			style={{
				width: size,
				height: size,
				borderRadius,
				backgroundColor: visual.bg,
				color: visual.color,
			}}
			title={name}
		>
			<span className={styles.icon_inner} style={{fontSize: Math.max(10, size * 0.48)}}>
				{visual.icon}
			</span>
		</div>
	);
}

export default CategoryIcon;
