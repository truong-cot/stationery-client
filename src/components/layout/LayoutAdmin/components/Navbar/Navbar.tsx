import {useEffect, useState} from 'react';

import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import {deleteCookie} from 'cookies-next/client';
import {UserEdit} from 'iconsax-react';
import {Warning2} from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {IoLogOutOutline} from 'react-icons/io5';
import {useDispatch, useSelector} from 'react-redux';
import Dialog from '~/components/common/Dialog';
import {COOKIE_KEY, menusAdmin, PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import images from '~/constants/images/images';
import useWindowWidth from '~/hooks/useWindowWidth';
import {RootState} from '~/store';
import {logout} from '~/store/auth.slice';
import {setInfoUser} from '~/store/user.slice';
import {PropsNavbar} from './interfaces';
import styles from './Navbar.module.scss';

function Navbar({}: PropsNavbar) {
	const pathname = usePathname();
	const dispatch = useDispatch();

	const width = useWindowWidth({debounceMs: 150});

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
				<Tippy content='Trang cá nhân'>
					<Link href={PATH.Any} className={styles.action}>
						<UserEdit size={22} className={styles.action_icon} />
					</Link>
				</Tippy>
				<div
					className={styles.action_line}
					style={{
						width: small ? '20px' : '1px',
						height: small ? '1px' : '16px',
						background: '#f4f5f6',
					}}
				></div>

				{/* <Tippy content="Thông báo">
          <TippyHeadless
            interactive
            visible={openNotify}
            onClickOutside={() => setOpenNotify(false)}
            placement="right-start"
            render={(attrs: any) => <BoxNotify open={openNotify} />}
          >
            <div
              className={styles.action}
              onClick={() => setOpenNotify(!openNotify)}
            >
              <Notification size={22} className={styles.action_icon} />
              {data.count > 0 && (
                <div className={styles.noti}>
                  {data.count > 99 ? (
                    <span>99+</span>
                  ) : (
                    <span>{data.count}</span>
                  )}
                </div>
              )}
            </div>
          </TippyHeadless>
        </Tippy> */}
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
