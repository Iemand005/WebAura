class Aura {

	/** @type {HIDDevice?} */
	device = null;

	async getAuraDevice() {
        	if (!('hid' in navigator)) return;
		const devices = await navigator.hid.requestDevice({
		filters: [{ vendorId: 0x0B05 }]
		});

		const device = devices.find(device => device.collections.find(collection => collection.usagePage === 0xFF31 && collection.usage === 0x76));

		if (device) this.device = device;
	}
}