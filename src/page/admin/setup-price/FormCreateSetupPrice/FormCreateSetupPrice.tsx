import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import type {PropsFormCreateSetupPrice} from './interfaces';
import setupPriceServices from '~/services/setup-price.service';
import {price} from '~/funcs/convertCoin';
import {toastWarn} from '~/funcs/toast';

interface IFormCreateSetupPrice {
	min: string;
	max: string;
	description: string;
}

const initForm: IFormCreateSetupPrice = {
	min: '0',
	max: '0',
	description: '',
};

function FormCreateSetupPrice({onClose}: PropsFormCreateSetupPrice) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreateSetupPrice>(initForm);

	const funcCreateSetupPrice = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tạo khoảng giá thành công!',
				http: setupPriceServices.create({
					min: price(form.min),
					max: price(form.max),
					description: form.description,
				}),
			}),
		onSuccess: () => {
			setForm(initForm);
			onClose();
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.pageListSetupPrice]});
		},
	});

	const handleCreateSetupPrice = () => {
		if (price(form.min) == 0 && price(form.max) == 0) return toastWarn({msg: 'Nhập khoảng giá!'});

		return funcCreateSetupPrice.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateSetupPrice}>
			<Loading loading={funcCreateSetupPrice.isPending} />
			<WrapperFormPostion
				width={540}
				title='Thêm mới khoảng giá'
				actions={
					<FlexLayout row gap-8>
						<Button p_8_24 rounded_8 white bold maxHeight onClick={onClose}>
							Hủy bỏ
						</Button>
						<ContextForm.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_8_24 rounded_8 bright-cyan bold maxHeight>
									Lưu lại
								</Button>
							)}
						</ContextForm.Consumer>
					</FlexLayout>
				}
			>
				<WrapperForm title='Thông tin khoảng giá'>
					<FlexLayout column gap-16>
						<Input
							label={
								<span>
									Từ <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập khoảng giá min'
							type='text'
							name='min'
							isMoney
							isRequired
							isBlur
						/>
						<div>
							<Input
								label={
									<span>
										Đến <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập khoảng giá max'
								type='text'
								name='max'
								isMoney
								isRequired
								isBlur
							/>
						</div>
						<TextArea label='Mô tả' placeholder='Nhập ghi chú' name='description' />
					</FlexLayout>
				</WrapperForm>
			</WrapperFormPostion>
		</Form>
	);
}

export default FormCreateSetupPrice;
