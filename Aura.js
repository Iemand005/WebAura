class Aura {

	async getAuraDevice() {
		const devices = await navigator.hid.requestDevice({
		filters: [{ vendorId: 0x0B05 }]
		});

		devices.forEach(device => {
			device.collections.forEach(collection => {
				console.log(collection.usagePage == 0xFF31)
			});
		});
	}
}