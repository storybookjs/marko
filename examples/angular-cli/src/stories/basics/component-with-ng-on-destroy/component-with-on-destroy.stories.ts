import { Component, OnDestroy, OnInit } from '@angular/core';
import { Story, Meta } from '@storybook/angular';

@Component({
  selector: 'on-destroy',
  template: `Current time: {{ time }} <br />
    📝 The current time in console should no longer display after a change of stroy`,
})
class OnDestroyComponent implements OnInit, OnDestroy {
  time: string;

  interval: any;

  ngOnInit(): void {
    const myTimer = () => {
      const d = new Date();
      this.time = d.toLocaleTimeString();
      console.info(`Current time: ${this.time}`);
    };

    myTimer();
    this.interval = setInterval(myTimer, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}

export default {
  title: 'Basics / Component / with ngOnDestroy',
  component: OnDestroyComponent,
  parameters: {
    storyshots: { disable: true }, // disabled due to new Date()
  },
} as Meta;

export const SimpleComponent: Story = () => ({
  component: OnDestroyComponent,
});
