import type { ComponentMeta } from '@storybook/react';
import { AccountCreate } from './Create';

const Meta: ComponentMeta<typeof AccountCreate> = {
  title: 'Features / Account / Components / Create',
  component: AccountCreate
};

const Template = (args) => <AccountCreate {...args} />;

/**
 * TODO: When we can mock mutations we might want to show more states.
 */

export const Create = Template.bind({});

export default Meta;
