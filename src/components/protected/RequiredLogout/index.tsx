'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {useSelector} from 'react-redux';
import {PATH} from '~/constants/config';
import {RootState} from '~/store';

interface props {
	children: React.ReactNode;
}

function RequiredLogout({children}: props) {
	const {replace} = useRouter();
	const {isLogin, isLoading} = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (isLogin && !isLoading) replace(PATH.AdminAccount);
	}, [isLogin, isLoading, replace]);

	if (!isLogin && !isLoading) {
		return <>{children}</>;
	}

	return null;
}

export default RequiredLogout;
