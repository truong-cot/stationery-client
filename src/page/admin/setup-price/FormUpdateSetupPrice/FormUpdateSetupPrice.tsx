import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input, TextArea} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import WrapperForm from '~/components/utils/WrapperForm';
import WrapperFormPostion from '~/components/utils/WrapperFormPostion';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import type {IDetailSetupPrice, PropsFormUpdateSetupPrice} from './interfaces';
import setupPriceServices from '~/services/setup-price.service';
import {convertCoin, price} from '~/funcs/convertCoin';
import {toastWarn} from '~/funcs/toast';

interface IFormUpdateSetupPrice {
	min: string;
	max: string;
	description: string;
}

const initForm: IFormUpdateSetupPrice = {
	min: '0',
	max: '0',
	description: '',
};

function FormUpdateSetupPrice({_idSetupPrice, onClose}: PropsFormUpdateSetupPrice) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateSetupPrice>(initForm);

	const {data: setupPrice, isSuccess} = useQuery<IDetailSetupPrice>({
		queryKey: [QUERY_KEY.detailSetupPrice, _idSetupPrice],
		queryFn: () =>
			httpRequest({
				http: setupPriceServices.detail({
					_id: _idSetupPrice,
				}),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
		enabled: !!_idSetupPrice,
	});

	useEffect(() => {
		if (!!setupPrice && isSuccess) {
			setForm({
				min: convertCoin(setupPrice?.min || 0),
				max: convertCoin(setupPrice?.max || 0),
				description: setupPrice?.description || '',
			});
		}
	}, [setupPrice, isSuccess]);

	const funcUpdateSetupPrice = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa khoảng giá thành công!',
				http: setupPriceServices.update({
					_id: _idSetupPrice,
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

		return funcUpdateSetupPrice.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleCreateSetupPrice}>
			<Loading loading={funcUpdateSetupPrice.isPending} />
			<WrapperFormPostion
				width={540}
				title='Chỉnh sửa khoảng giá'
				actions={
					<FlexLayout row items-center fit-height gap-8 wrap>
						<div>
							<Button p_8_24 rounded_8 white bold div onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<ContextForm.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone} p_8_24 rounded_8 bright-cyan bold d_block>
										Cập nhật
									</Button>
								</div>
							)}
						</ContextForm.Consumer>
					</FlexLayout>
				}
			>
				<WrapperForm title='Thông tin tài khoảng giá'>
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

export default FormUpdateSetupPrice;
