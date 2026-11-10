'use client';

import {useInfiniteQuery} from '@tanstack/react-query';
import {ArrowDown2, BoxSearch, Call, ReceiptSearch} from 'iconsax-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import {IoCloseCircle} from 'react-icons/io5';
import {useSelector} from 'react-redux';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import LayoutGrid from '~/components/layout/LayoutGrid';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import {httpRequest} from '~/funcs/httpRequest';
import {formatPhoneVN} from '~/funcs/optionConvert';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import {toastWarn} from '~/funcs/toast';
import {validatePhoneNumber} from '~/funcs/validate';
import clientServices, {IClientTrackingOrderPayload, IClientTrackingOrderResponse} from '~/services/client.service';
import {RootState} from '~/store';
import OrderTrackingCard from '../OrderTrackingCard';
import styles from './MainTrackingOrder.module.scss';
import type {PropsMainTrackingOrder} from './interfaces';

const TRACKING_PAGE_SIZE = 2;

const parseTrackingQuery = (rawValue: string): IClientTrackingOrderPayload | null => {
	const trimmed = rawValue.trim();
	if (!trimmed) return null;

	if (/^dh/i.test(trimmed)) {
		return {code: trimmed.toUpperCase()};
	}

	if (validatePhoneNumber(trimmed)) {
		return {phone: trimmed};
	}

	return null;
};

function MainTrackingOrder({}: PropsMainTrackingOrder) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const {_q} = getQueryParams(searchParams);
	const queryString = typeof _q === 'string' ? _q.trim() : '';

	const {contact} = useSelector((state: RootState) => state.user);

	const [keyword, setKeyword] = useState<string>(queryString);
	const [searchNonce, setSearchNonce] = useState<number>(0);

	useEffect(() => {
		setKeyword(queryString);
	}, [queryString]);

	const activePayload = useMemo(() => {
		return parseTrackingQuery(queryString);
	}, [queryString]);

	const lastQuery = useMemo(() => {
		return activePayload?.code || activePayload?.phone || queryString;
	}, [activePayload, queryString]);

	const phoneNumber = contact?.phone || '0384728493';
	const formattedPhone = formatPhoneVN(phoneNumber);

	const {data, isFetching, isFetched, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery<IClientTrackingOrderResponse>({
		queryKey: ['client-tracking-order', activePayload?.code || '', activePayload?.phone || '', searchNonce],
		initialPageParam: 1,
		queryFn: async ({pageParam}) => {
			const pageNum = Number(pageParam) || 1;
			const payload: IClientTrackingOrderPayload = activePayload?.phone
				? {
						phone: activePayload.phone,
						page: pageNum,
						pageSize: TRACKING_PAGE_SIZE,
					}
				: {
						code: activePayload?.code,
					};

			const res = await httpRequest({
				showMessageFailed: true,
				showMessageSuccess: false,
				http: clientServices.trackingOrder(payload),
			});

			if (Array.isArray(res)) {
				return {
					items: res,
					pagination: {
						currentPage: 1,
						totalCount: res.length,
					},
				};
			}

			return {
				items: Array.isArray(res?.items) ? res.items : [],
				pagination: {
					currentPage: res?.pagination?.currentPage || pageNum,
					totalCount: res?.pagination?.totalCount ?? (Array.isArray(res?.items) ? res.items.length : 0),
				},
			};
		},
		getNextPageParam: (lastPage, allPages) => {
			if (!activePayload?.phone) return undefined;
			const loadedCount = allPages.reduce((sum, page) => sum + (page.items?.length || 0), 0);
			const total = lastPage?.pagination?.totalCount ?? 0;
			if (loadedCount < total && (lastPage?.items?.length || 0) > 0) {
				return (lastPage?.pagination?.currentPage || allPages.length) + 1;
			}
			return undefined;
		},
		enabled: !!activePayload,
		retry: false,
		staleTime: 0,
	});

	const orders = useMemo(() => {
		const all = data?.pages?.flatMap((page) => page.items || []) || [];
		const seen = new Set<string>();
		return all.filter((item) => {
			const key = item._id || item.code;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}, [data]);

	const totalCount = data?.pages?.[0]?.pagination?.totalCount ?? orders.length;
	const hasSearched = !!activePayload && (orders.length > 0 || (isFetched && !isFetching));

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmed = keyword.trim();
		if (!trimmed) {
			toastWarn({msg: 'Vui lòng nhập số điện thoại hoặc mã đơn hàng!'});
			return;
		}

		const payload = parseTrackingQuery(trimmed);
		if (!payload) {
			toastWarn({msg: 'Vui lòng nhập đúng số điện thoại (10 số) hoặc mã đơn hàng (VD: DH2611074192)!'});
			return;
		}

		const displayQuery = payload.code || payload.phone || trimmed;
		setSearchNonce((prev) => prev + 1);

		if (displayQuery !== queryString) {
			updateQueryParams(router, pathname, searchParams, {
				set: {_q: displayQuery},
				options: {scroll: false},
			});
		}
	};

	const handleClear = () => {
		setKeyword('');
		updateQueryParams(router, pathname, searchParams, {
			delete: ['_q'],
			options: {scroll: false},
		});
	};

	return (
		<div className={styles.main_tracking}>
			<Loading loading={isFetching && !isFetchingNextPage} />

			<LayoutGrid>
				<div className={styles.breadcrumb}>
					<Breadcrumb
						isPadding={false}
						listUrls={[
							{path: PATH.Home, title: 'Trang chủ'},
							{path: PATH.Product, title: 'Sản phẩm'},
							{path: '', title: 'Tra cứu đơn hàng'},
						]}
					/>
				</div>

				{/* Search Hero Box */}
				<section className={styles.search_hero}>
					<div className={styles.hero_icon}>
						<ReceiptSearch size='30' color='#00b7c4' variant='Bold' />
					</div>
					<h1 className={styles.title}>Tra cứu đơn hàng</h1>
					<p className={styles.description}>
						Nhập <strong>Số điện thoại</strong> (để xem toàn bộ lịch sử đơn hàng) hoặc <strong>Mã đơn hàng</strong> (VD:{' '}
						<code>DH2611074192</code>) để kiểm tra tiến độ xử lý.
					</p>

					<form onSubmit={handleSubmit} className={styles.search_form}>
						<div className={styles.input_wrap}>
							<ReceiptSearch size='20' color='#6b7280' />
							<input
								type='text'
								className={styles.input}
								placeholder='Nhập Số điện thoại hoặc Mã đơn hàng (VD: DH...)'
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
							/>
							{keyword && (
								<button type='button' className={styles.clear_btn} onClick={handleClear} aria-label='Xóa từ khóa'>
									<IoCloseCircle size={20} color='#9ca3af' />
								</button>
							)}
						</div>

						<div className={styles.submit_btn}>
							<Button
								maxHeight
								className={styles.search_btn_inner}
								icon={<ReceiptSearch size='18' color='#fff' />}
								bright-cyan
								bold
								rounded_8
								p_12_24
							>
								Tra cứu ngay
							</Button>
						</div>
					</form>

					<div className={styles.hint_pills}>
						<span>Gợi ý:</span>
						<span className={styles.pill}>Mã đơn bắt đầu bằng DH...</span>
						<span className={styles.pill}>Số điện thoại đặt hàng (10 số)</span>
					</div>
				</section>

				{/* Results Section */}
				<section className={styles.results_section}>
					{!hasSearched ? (
						<div className={styles.guide_box}>
							<div className={styles.guide_icon}>
								<BoxSearch size='36' color='#00b7c4' variant='Bulk' />
							</div>
							<h4>Kiểm tra trạng thái đơn hàng nhanh chóng</h4>
							<p>
								Không cần đăng nhập tài khoản. Chỉ cần nhập số điện thoại bạn đã dùng khi đặt hàng hoặc mã đơn hàng nhận
								được sau khi thanh toán.
							</p>
						</div>
					) : orders.length > 0 ? (
						<div className={styles.orders_wrap}>
							<div className={styles.result_head}>
								<h3>
									Kết quả tra cứu cho <span>&ldquo;{lastQuery}&rdquo;</span>
								</h3>
								<span className={styles.result_count}>Tìm thấy {totalCount} đơn hàng</span>
							</div>

							<div className={styles.orders_list}>
								{orders.map((order) => (
									<OrderTrackingCard key={order._id || order.code} order={order} />
								))}
							</div>

							{hasNextPage && (
								<div className={styles.load_more}>
									<Button
										div
										maxContent
										disable={isFetchingNextPage}
										icon={<ArrowDown2 size='18' color='#009aa6' />}
										white
										bold
										rounded_8
										p_10_24
										onClick={() => fetchNextPage()}
									>
										{isFetchingNextPage
											? 'Đang tải thêm...'
											: `Xem thêm (${Math.max(0, totalCount - orders.length)} đơn hàng)`}
									</Button>
								</div>
							)}
						</div>
					) : (
						<div className={styles.empty_result}>
							<div className={styles.empty_icon}>
								<ReceiptSearch size='36' color='#d92d20' variant='Bulk' />
							</div>
							<h4>Không tìm thấy đơn hàng nào!</h4>
							<p>
								Không có đơn hàng nào khớp với thông tin <strong>&ldquo;{lastQuery}&rdquo;</strong>. Vui lòng kiểm tra lại
								số điện thoại hoặc mã đơn hàng của bạn.
							</p>
							<div className={styles.support_box}>
								<Call size='16' color='#009aa6' variant='Bold' />
								<span>
									Cần hỗ trợ? Liên hệ Hotline: <a href={`tel:${phoneNumber}`}>{formattedPhone}</a>
								</span>
							</div>
						</div>
					)}
				</section>
			</LayoutGrid>
		</div>
	);
}

export default MainTrackingOrder;
