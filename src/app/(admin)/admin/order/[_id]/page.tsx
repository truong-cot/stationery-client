'use client';

import {useParams, useRouter} from 'next/navigation';
import PositionContainer from '~/components/common/PositionContainer';
import {PATH} from '~/constants/config';
import DetailOrder from '~/page/admin/order/DetailOrder';

export default function Page() {
	const router = useRouter();
	const params = useParams();
	const _id = params?._id as string;

	return (
		<PositionContainer open={true} onClose={() => router.push(PATH.AdminOrder)}>
			<DetailOrder
				_idOrder={_id}
				onClose={() => router.push(PATH.AdminOrder)}
				onEdit={() => router.push(`${PATH.AdminOrder}?_idUpdate=${_id}`)}
			/>
		</PositionContainer>
	);
}
