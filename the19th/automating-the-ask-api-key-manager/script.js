let decrypted = CryptoJSAesJson.decrypt(MyAjax.jsondata, 'rkwfPafUMSiZtAsdfrtvblF0JM07')
const hiddenValues = document.querySelectorAll('.hidden-value');

hiddenValues.forEach(hiddenValue => {
	hiddenValue.addEventListener('mouseover', () => {
		hiddenValue.setAttribute('title', hiddenValue.getAttribute('data-value'));
	});

	hiddenValue.addEventListener('mouseout', () => {
		hiddenValue.removeAttribute('title');
	});
});