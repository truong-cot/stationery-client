'use client';

import {PATH} from '~/constants/config';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '~/store';
import {useRouter} from 'next/navigation';

interface IRequireAuthProps {
	children: React.ReactNode;
}

export default function RequireAuth(props: IRequireAuthProps) {
	const {replace} = useRouter();

	const {isLogin, isLoading} = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (!isLogin && !isLoading) replace(PATH.AuthLogin);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLogin, isLoading]);

	if (isLogin && !isLoading) {
		return <>{props.children}</>;
	}

	return null;
}
