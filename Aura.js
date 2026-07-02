class Aura {

	/** @type {HIDDevice?} */
	device = null;

	async getAuraDevice() {
        	if (!('hid' in navigator)) return;
		const devices = await navigator.hid.requestDevice({
		filters: [{ vendorId: 0x0B05 }]
		});

		const device = devices.find(device => device.collections.find(collection => collection.usagePage === 0xFF31 && collection.usage === 0x76));

		if (!device) return;

		if (!device.opened) await device.open();

		this.device = device;
	}

	async sendAuraInitReport() {
		if (!this.device) return;
		const buffer = new ArrayBuffer(63); 
		const view = new DataView(buffer);

		view.setUint8(0, 0xBC); // cmd (byte 1)
		view.setUint8(1, 0x01); // mode (byte 2)


		const reportId = 0x5A; // byte 0
		const data = new Uint8Array(buffer);

		await this.device.sendFeatureReport(reportId, data);
	}

	/**
	 * @param {number} r 
	 * @param {number} g 
	 * @param {number} b 
	 */
	async sendAuraColorReport(r, g, b) {
		if (!this.device) return;
		const buffer = new ArrayBuffer(63);
		const view = new DataView(buffer);

		view.setUint8(0, 0xBC); // cmd
		view.setUint8(1, 0x01); // mode
		view.setUint8(2, 0x01); // apply

		view.setUint8(8, r);  // r
		view.setUint8(9, g);  // g
		view.setUint8(10, b); // b

		const reportId = 0x5A;
		const data = new Uint8Array(buffer);

		await this.device.sendFeatureReport(reportId, data);
	}


}