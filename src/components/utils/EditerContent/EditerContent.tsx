'use client';

import React, {useEffect, useMemo, useRef} from 'react';

import {PropsEditerContent} from './interfaces';
import styles from './EditerContent.module.scss';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), {ssr: false});

const copyStringToClipboard = function (str: any) {
	var el: any = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style = {position: 'absolute', left: '-9999px'};
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};

const facilityMergeFields = [
	'FacilityNumber',
	'FacilityName',
	'Address',
	'MapCategory',
	'Latitude',
	'Longitude',
	'ReceivingPlant',
	'TrunkLine',
	'SiteElevation',
];
const inspectionMergeFields = ['InspectionCompleteDate', 'InspectionEventType'];

const createOptionGroupElement = (mergeFields: any, optionGrouplabel: any) => {
	let optionGroupElement = document.createElement('optgroup');
	optionGroupElement.setAttribute('label', optionGrouplabel);
	for (let index = 0; index < mergeFields.length; index++) {
		let optionElement = document.createElement('option');
		optionElement.setAttribute('class', 'merge-field-select-option');
		optionElement.setAttribute('value', mergeFields[index]);
		optionElement.text = mergeFields[index];
		optionGroupElement.appendChild(optionElement);
	}
	return optionGroupElement;
};

const buttons = [
	'undo',
	'redo',
	'|',
	'bold',
	'strikethrough',
	'underline',
	'italic',
	'|',
	'superscript',
	'subscript',
	'|',
	'align',
	'|',
	'ul',
	'ol',
	'outdent',
	'indent',
	'|',
	'font',
	'fontsize',
	'brush',
	'paragraph',
	'|',
	'image',
	'link',
	'table',
	'|',
	'hr',
	'eraser',
	'copyformat',
	'|',
	'fullsize',
	'selectall',
	'print',
	'|',
	'source',
	'|',
	{
		name: 'insertMergeField',
		tooltip: 'Insert Merge Field',
		iconURL: 'images/merge.png',
		popup: (editor: any, current: any, self: any, close: any) => {
			function onSelected(e: any) {
				let mergeField = e.target.value;
				if (mergeField) {
					editor.selection.insertNode(editor.create.inside.fromHTML('{{' + mergeField + '}}'));
				}
			}
			let divElement = editor.create.div('merge-field-popup');

			let labelElement: any = document.createElement('label');
			labelElement.setAttribute('class', 'merge-field-label');
			labelElement.text = 'Merge field: ';
			divElement.appendChild(labelElement);

			let selectElement = document.createElement('select');
			selectElement.setAttribute('class', 'merge-field-select');
			selectElement.appendChild(createOptionGroupElement(facilityMergeFields, 'Facility'));
			selectElement.appendChild(createOptionGroupElement(inspectionMergeFields, 'Inspection'));
			selectElement.onchange = onSelected;
			divElement.appendChild(selectElement);

			return divElement;
		},
	},
	{
		name: 'copyContent',
		tooltip: 'Copy HTML to Clipboard',
		iconURL: 'images/copy.png',
		exec: function (editor: any) {
			let html = editor.value;
			copyStringToClipboard(html);
		},
	},
];

function EditerContent({label, content, setContent, ...props}: PropsEditerContent) {
	const editorRef = useRef<any>(null);

	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.editor?.focus();
		}
	}, []);

	const config: any = useMemo(
		() => ({
			readonly: false,
			toolbar: true,
			spellcheck: true,
			language: 'vi',
			toolbarButtonSize: 'medium',
			toolbarAdaptive: false,
			showCharsCounter: true,
			showWordsCounter: true,
			showXPathInStatusbar: false,
			askBeforePasteHTML: true,
			askBeforePasteFromWord: true,
			defaultActionOnPaste: 'insert_clear_html',
			buttons: buttons,

			width: 800,
			height: 842,

			// Config Placeholder
			placeholder: 'Nhập mô tả ...',
			showPlaceholder: true,
			useInputsPlaceholder: true,

			// Config Focus editor
			autofocus: true,
			cursorAfterAutofocus: 'end',
			saveSelectionOnBlur: true,

			disablePlugins: ['mobile'],

			// Xử lý ảnh
			uploader: {
				insertImageAsBase64URI: false,
				url: 'https://xdsoft.net/jodit/finder/?action=fileUpload',
			},

			// uploader: {
			// 	insertImageAsBase64URI: false,
			// 	filesVariableName: () => 'files',
			// 	process: (resp: any, editor: any, files: File[], progress: any) => {
			// 		uploadService
			// 			.uploadMutilImage(files, '2')
			// 			.then((response) => {
			// 				if (response?.data?.error?.code === 0) {
			// 					const imageUrls = response.data.data as string[];
			// 					imageUrls.forEach((url) => {
			// 						editor.selection.insertImage(url);
			// 					});
			// 				} else {
			// 					editor.alert('Upload file thất bại!');
			// 				}
			// 			})
			// 			.catch((error) => {
			// 				console.error('Upload error:', error);
			// 				editor.alert('Lỗi khi upload file!');
			// 			});
			// 		return false;
			// 	},
			// },

			filebrowser: {
				ajax: {
					url: 'https://xdsoft.net/jodit/finder/',
				},
				height: 580,
			},

			imageEditorOptions: {
				resize: false,
			},
			imageDefaultWidth: null,
			imageDefaultHeight: null,
			events: {
				change: (newValue: string) => {
					const parser = new DOMParser();
					const doc = parser.parseFromString(newValue, 'text/html');
					const imgs = doc.querySelectorAll('img');

					let updated = false;
					imgs.forEach((img) => {
						if (img.hasAttribute('width') || img.hasAttribute('height') || img.hasAttribute('style')) {
							img.removeAttribute('width');
							img.removeAttribute('height');
							img.removeAttribute('style');
							updated = true;
						}
					});

					if (updated) {
						const cleaned = doc.body.innerHTML;
						setContent(cleaned);
					}
				},
			},
			allowResizeTags: new Set(['img']),
			resizer: {
				showSize: true,
				hideSizeTimeout: 2000,
				useAspectRatio: false,
				forImageChangeAttributes: true,
				min_width: '100%',
				min_height: '100%',
			},

			removePlugins: ['image-resize', 'resize-cells'],

			style: {
				img: {
					resize: 'none',
					maxWidth: '100% !important',
					height: 'auto !important',
					display: 'block',
				},
			},
		}),
		[editorRef?.current]
	);

	function cleanImageAttributes(html: string): string {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const imgs = doc.querySelectorAll('img');

		imgs.forEach((img) => {
			img.removeAttribute('width');
			img.removeAttribute('height');
			img.removeAttribute('style');
		});

		return doc.body.innerHTML;
	}

	return (
		<div className={styles.content}>
			<p className={styles.label}>{label}</p>
			<JoditEditor
				{...props}
				ref={editorRef}
				value={content}
				config={config}
				onBlur={(newContent) => setContent(cleanImageAttributes(newContent))}
				onChange={(value) => setContent(cleanImageAttributes(value))}
			/>
		</div>
	);
}

export default EditerContent;
