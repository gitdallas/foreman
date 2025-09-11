import React from 'react';
import ActivationKeys, {
  ActivationKeyDetails,
  NewActivationKey,
} from '../../components/ActivationKeys';

const ActivationKeysRoutes = [
  {
    path: '/activation_keys',
    exact: true,
    render: props => <ActivationKeys {...props} />,
  },
  {
    path: '/activation_keys/new',
    exact: true,
    render: props => <NewActivationKey {...props} />,
  },
  {
    path: '/activation_keys/:id',
    render: props => <ActivationKeyDetails {...props} />,
  },
];

export default ActivationKeysRoutes;
