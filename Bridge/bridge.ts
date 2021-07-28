export const Bridge = (): void => {
  interface Device {
    isEnabled: () => boolean;
    disable: () => void;
    enable: () => void;
    getVolume: () => number;
    setVolume: (percent: number) => void;
    setChannel: (channel: number) => void;
    getChannel: () => number;
  }

  class RemoteControl {
    device: Device;
    volumeStrength: number;
    constructor(device: Device) {
      this.device = device;
      this.volumeStrength = 10;
    }

    togglePower() {
      if (this.device.isEnabled()) {
        this.device.disable();
      } else {
        this.device.enable();
      }
    }

    volumeDown() {
      this.device.setVolume(this.device.getVolume() - this.volumeStrength);
    }

    volumeUp() {
      this.device.setVolume(this.device.getVolume() + this.volumeStrength);
    }

    channelDown() {
      this.device.setChannel(this.device.getChannel() - 1);
    }

    channelUp() {
      this.device.setChannel(this.device.getChannel() + 1);
    }
  }

  class FancyRemoteControl extends RemoteControl {
    mute() {
      this.device.setVolume(0);
    }
  }

  class TV implements Device {
    enabled: boolean;
    volume: number;
    channel: number;
    constructor() {
      this.enabled = false;
      this.volume = 10;
      this.channel = 1;
    }
    isEnabled() {
      return this.enabled;
    }
    enable() {
      this.enabled = true;
    }
    disable() {
      this.enabled = false;
    }
    getVolume() {
      return this.volume;
    }
    setVolume(percent: number) {
      this.volume = percent;
    }
    getChannel() {
      return this.channel;
    }
    setChannel(channel: number) {
      this.channel = channel;
    }
  }

  class Radio implements Device {
    enabled: boolean;
    volume: number;
    channel: number;
    constructor() {
      this.enabled = true;
      this.volume = 200;
      this.channel = 234;
    }
    isEnabled() {
      return this.enabled;
    }
    enable() {
      this.enabled = true;
    }
    disable() {
      this.enabled = false;
    }
    getVolume() {
      return this.volume;
    }
    setVolume(percent: number) {
      this.volume = percent;
    }
    getChannel() {
      return this.channel;
    }
    setChannel(channel: number) {
      this.channel = channel;
    }
  }

  const tv = new TV();
  const tvRemote = new RemoteControl(tv);
  console.log(tv.isEnabled());
  tvRemote.togglePower();
  console.log(tv.isEnabled());

  const radio = new Radio();
  const radioRemote = new FancyRemoteControl(radio);
  console.log(radio.getVolume());
  radioRemote.mute();
  console.log(radio.getVolume());
};
