import {useEffect, useState} from 'react';

import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import {deleteCookie} from 'cookies-next/client';
import {LockSlash, UserEdit} from 'iconsax-react';
import {Warning2} from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {IoLogOutOutline} from 'react-icons/io5';
import {useDispatch, useSelector} from 'react-redux';
import Dialog from '~/components/common/Dialog';
import PositionContainer from '~/components/common/PositionContainer';
import {COOKIE_KEY, menusAdmin, PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import images from '~/constants/images/images';
import {getQueryParams, updateQueryParams} from '~/funcs/queryParams';
import useWindowWidth from '~/hooks/useWindowWidth';
import {RootState} from '~/store';
import {logout} from '~/store/auth.slice';
import {setInfoUser} from '~/store/user.slice';
import FormChangePassword from '../../../../../page/auth/FormChangePassword';
import {PropsNavbar} from './interfaces';
import styles from './Navbar.module.scss';
import FormUpdateInfoProfile from '../FormUpdateInfoProfile';

function Navbar({}: PropsNavbar) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const dispatch = useDispatch();

	const width = useWindowWidth({debounceMs: 150});

	const {_layout} = getQueryParams(searchParams);

	const {infoUser} = useSelector((state: RootState) => state.user);

	const [small, setSmall] = useState<boolean>(false);
	const [openLogout, setOpenLogout] = useState<boolean>(false);

	const checkActivePath = (pathActive: string) => {
		return pathname === pathActive || pathname.startsWith(pathActive + '/');
	};

	useEffect(() => {
		if (width <= 1200) setSmall(true);
	}, [width]);

	const handleLogout = () => {
		deleteCookie(COOKIE_KEY.ACCESS_TOKEN);
		dispatch(logout());
		dispatch(setInfoUser(null));

		setOpenLogout(false);
	};

	return (
		<div className={clsx(styles.container, {[styles.small]: small})}>
			<div className={styles.head}>
				<Link href={PATH.AdminDashboard} className={styles.logo}>
					<Image alt='Logo' src={icons.logo_small} width={48} height={48} />
				</Link>
				<div className={styles.menu_line} onClick={() => setSmall(!small)}>
					<Image alt='Menu line' src={icons.menuLine} width={24} height={24} />
				</div>
			</div>

			<div className={styles.menus}>
				{menusAdmin.map((tab, y) => (
					<Tippy key={y} content={tab.title} disabled={!small}>
						<Link
							href={tab.path}
							className={clsx(styles.tab, {
								[styles.active]: checkActivePath(tab.pathActive),
							})}
						>
							<tab.icon size={22} className={styles.icon} />
							<p>{tab.title}</p>
						</Link>
					</Tippy>
				))}
			</div>

			<div className={styles.line}></div>
			<div className={styles.actions}>
				<Tippy content='Đổi mật khẩu'>
					<div
						className={styles.action}
						onClick={() =>
							updateQueryParams(router, pathname, searchParams, {
								set: {
									_layout: 'change-password',
								},
								options: {
									scroll: false,
								},
							})
						}
					>
						<LockSlash size={22} className={styles.action_icon} color='#202939' />
					</div>
				</Tippy>
				<div
					className={styles.action_line}
					style={{
						width: small ? '20px' : '1px',
						height: small ? '1px' : '16px',
						background: '#f4f5f6',
					}}
				></div>
				<Tippy content='Thông tin cá nhân'>
					<div
						className={styles.action}
						onClick={() =>
							updateQueryParams(router, pathname, searchParams, {
								set: {
									_layout: 'info-profile',
								},
								options: {
									scroll: false,
								},
							})
						}
					>
						<UserEdit size={22} className={styles.action_icon} color='#202939' />
					</div>
				</Tippy>
			</div>
			<Tippy content='Đăng xuất'>
				<div className={styles.profile} onClick={() => setOpenLogout(true)}>
					<div className={styles.info}>
						<Image
							alt='Avatar'
							src={images.avatar}
							width={small ? 32 : 40}
							height={small ? 32 : 40}
							style={{borderRadius: '50%', border: '1px solid #20C874'}}
						/>
						<div className={styles.name}>
							<h5>{infoUser?.username}</h5>
							<p>{infoUser?.name}</p>
						</div>
					</div>
					<IoLogOutOutline size={24} color='#EE0033' />
				</div>
			</Tippy>

			<PositionContainer
				open={_layout == 'change-password'}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_layout'],
						options: {
							scroll: false,
						},
					})
				}
			>
				<FormChangePassword
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_layout'],
							options: {
								scroll: false,
							},
						})
					}
				/>
			</PositionContainer>

			<PositionContainer
				open={_layout == 'info-profile'}
				onClose={() =>
					updateQueryParams(router, pathname, searchParams, {
						delete: ['_layout'],
						options: {
							scroll: false,
						},
					})
				}
			>
				<FormUpdateInfoProfile
					onClose={() =>
						updateQueryParams(router, pathname, searchParams, {
							delete: ['_layout'],
							options: {
								scroll: false,
							},
						})
					}
				/>
			</PositionContainer>

			<Dialog
				open={openLogout}
				onClose={() => setOpenLogout(false)}
				title='Đăng xuất'
				note='Bạn có muốn đăng xuất khỏi hệ thống không?'
				icon={<Warning2 size='28' color='#EE0033' />}
				type='error'
				onSubmit={handleLogout}
			/>
		</div>
	);
}

export default Navbar;
