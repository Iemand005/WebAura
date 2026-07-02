const ASUS_VID = 0x0B05;

class Aura {

	/** @type {HIDDevice?} */
	device = null;

	usagePage = 0xFF31;
	usage = 0x76;

	async init() {
		await this.getAuraDevice();
		await this.sendAuraInitReport();
	}

	async getAuraDevice() {
		if (!('hid' in navigator)) throw new Error("This browser does not support WebHID.");
		const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: ASUS_VID }] });

		const device = devices.find(device => device.collections.find(c => c.usagePage === this.usagePage && c.usage === this.usage));

		if (!device) throw new Error("No Aura device found.");
		if (!device.opened) await device.open();

		this.device = device;
	}

	/** @param {(view:DataView)=>void} viewInit  */
	async sendFeatureReport(viewInit) {
		if (!this.device) throw new Error("Not initialized.");
		const buffer = new ArrayBuffer(63);
		viewInit(new DataView(buffer));
		await this.device.sendFeatureReport(0x5A, new Uint8Array(buffer));
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
	/** @param {string} hex  */
	async setColorHex(hex) {
		const r = parseInt(hex.substring(1, 3), 16);
		const g = parseInt(hex.substring(3, 5), 16);
		const b = parseInt(hex.substring(5, 7), 16);
		await this.setColor(r, g, b);
	}
}