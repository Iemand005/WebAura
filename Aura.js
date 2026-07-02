class Aura {

	/** @type {HIDDevice?} */
	device = null;

	async init() {
		await this.getAuraDevice();
		await this.sendAuraInitReport();
	}

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

	/** @param {(view:DataView)=>void} viewInit  */
	async sendFeatureReport(viewInit) {
		if (!this.device) return;
		const buffer = new ArrayBuffer(63); 
		const view = new DataView(buffer);

		viewInit(view);

		const data = new Uint8Array(buffer);

		await this.device.sendFeatureReport(0x5A, data);
	}

	async sendAuraInitReport() {
		await this.sendFeatureReport(view => {
			view.setUint8(0, 0xBC); // cmd (byte 1)
			view.setUint8(1, 0x01); // mode (byte 2)
		});
	}

	/**
	 * @param {number} r 
	 * @param {number} g 
	 * @param {number} b 
	 */
	async setColor(r, g, b) {
		await this.sendFeatureReport(view => {
			view.setUint8(0, 0xBC); // cmd
			view.setUint8(1, 0x01); // mode
			view.setUint8(2, 0x01); // apply

			view.setUint8(8, r);
			view.setUint8(9, g);
			view.setUint8(10, b);
		});
	}
}