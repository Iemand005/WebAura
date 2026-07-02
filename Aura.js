class Aura {

	async getAuraDevice() {
        	if (!('hid' in navigator)) return;
		const devices = await navigator.hid.requestDevice({
		filters: [{ vendorId: 0x0B05 }]
		});

		return devices.find(device => device.collections.find(collection => collection.usagePage == 0xFF31));
	}
}