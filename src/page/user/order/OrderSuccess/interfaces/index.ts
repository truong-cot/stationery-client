import {IClientOrderResponse} from '~/services/client.service';

export interface PropsOrderSuccess {
	order: IClientOrderResponse | null;
	onClose: () => void;
}

