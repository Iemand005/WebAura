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

	async sendAuraInitReport() {
		if (!this.device) return;
		const buffer = new ArrayBuffer(63); 
		const view = new DataView(buffer);

		view.setUint8(0, 0xBC); // cmd (byte 1)
		view.setUint8(1, 0x01); // mode (byte 2)


		const reportId = 0x5A; // byte 0
		const data = new Uint8Array(buffer);

		await this.device.sendReport(reportId, data);
	}

}