'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Fragment, useEffect, useState} from 'react';
import Button from '~/components/common/Button';
import Form, {ContextForm, Input} from '~/components/common/Form';
import Loading from '~/components/common/Loading';
import FlexLayout from '~/components/layout/FlexLayout';
import FlexItem from '~/components/layout/FlexLayout/FlexItem';
import GridColumn from '~/components/layout/GridColumn';
import Breadcrumb from '~/components/utils/Breadcrumb';
import HeaderActions from '~/components/utils/HeaderActions';
import WrapperForm from '~/components/utils/WrapperForm';
import {PATH} from '~/constants/config';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/funcs/httpRequest';
import contactServices from '~/services/contact.service';
import type {IContact, PropsFormUpdateContact} from './interfaces';

interface IFormUpdateContact {
	phone: string;
	email: string;
	address: string;
	facebook: string;
	zalo: string;
	instagram: string;
	youtube: string;
}

const initForm: IFormUpdateContact = {
	phone: '',
	email: '',
	address: '',
	facebook: '',
	zalo: '',
	instagram: '',
	youtube: '',
};

function FormUpdateContact({}: PropsFormUpdateContact) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormUpdateContact>(initForm);

	const {data: contact, isSuccess} = useQuery<IContact>({
		queryKey: [QUERY_KEY.detailContact],
		queryFn: () =>
			httpRequest({
				http: contactServices.detail(),
			}),
		select(data) {
			return data;
		},
		staleTime: 0,
	});

	useEffect(() => {
		if (!!contact && isSuccess) {
			setForm(contact);
		}
	}, [contact, isSuccess]);

	const funcUpdateContact = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật thông tin liên hệ thành công!',
				http: contactServices.update(form),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: [QUERY_KEY.detailContact]});
		},
	});

	return (
		<Fragment>
			<Loading loading={funcUpdateContact.isPending} />
			<Form heightFull={true} form={form} setForm={setForm} onSubmit={funcUpdateContact.mutate}>
				<FlexLayout column gap-12>
					<HeaderActions title='Cập nhật thông tin liên hệ' />
					<Breadcrumb
						listUrls={[
							{
								title: 'Thông tin liên hệ',
								path: PATH.AdminContact,
							},
							{
								title: 'Cập nhật',
								path: '',
							},
						]}
						actions={
							<FlexLayout row gap-6>
								<ContextForm.Consumer>
									{({isDone}) => (
										<Button disable={!isDone} p_8_24 rounded_8 bright-cyan bold>
											Cập nhật
										</Button>
									)}
								</ContextForm.Consumer>
							</FlexLayout>
						}
					/>

					<FlexItem flex-1 overflow-x>
						<FlexLayout column gap-12>
							<WrapperForm title='Thông tin'>
								<FlexLayout column gap-16>
									<GridColumn col_2>
										<Input
											label='Số điện thoại'
											placeholder='Nhập số điện thoại'
											name='phone'
											type='text'
											isNumber
											isPhone
										/>
										<div>
											<Input label='Email' placeholder='Nhập email' name='email' type='text' isEmail />
										</div>
										<Input label='Địa chỉ' placeholder='Nhập địa chỉ' name='address' type='text' />
										<div>
											<Input label='Facebook' placeholder='Nhập link facebook' name='facebook' type='text' />
										</div>
										<Input label='Zalo' placeholder='Nhập link zalo' name='zalo' type='text' />
										<div>
											<Input label='Instagram' placeholder='Nhập link instagram' name='instagram' type='text' />
										</div>
										<Input label='Youtube' placeholder='Nhập link youtube' name='youtube' type='text' />
									</GridColumn>
								</FlexLayout>
							</WrapperForm>
						</FlexLayout>
					</FlexItem>
				</FlexLayout>
			</Form>
		</Fragment>
	);
}

export default FormUpdateContact;
