import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  Form,
  FormGroup,
  TextInput,
  TextArea,
  NumberInput,
  Button,
  ActionGroup,
} from '@patternfly/react-core';
import BreadcrumbBar from '../BreadcrumbBar';

const NewActivationKey = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    usage_limit: -1,
    environment_id: '',
    content_view_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/katello/api/activation_keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          activation_key: formData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        history.push(`/activation_keys/${result.id}`);
      } else {
        // eslint-disable-next-line no-console
        console.error('Error creating activation key');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating activation key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/activation_keys');
  };

  const breadcrumbItems = [
    { caption: __('Activation Keys'), url: '/activation_keys' },
    { caption: __('New Activation Key'), url: '/activation_keys/new' },
  ];

  return (
    <div>
      <BreadcrumbBar
        breadcrumbItems={breadcrumbItems}
        switcherItemUrl="/activation_keys"
      />

      <div className="new-activation-key">
        <h1>{__('Create Activation Key')}</h1>

        <Form onSubmit={handleSubmit}>
          <FormGroup
            label={__('Name')}
            isRequired
            fieldId="activation-key-name"
          >
            <TextInput
              isRequired
              type="text"
              id="activation-key-name"
              value={formData.name}
              onChange={value => handleInputChange('name', value)}
              placeholder={__('Enter activation key name')}
              ouiaId="activation-key-name-input"
            />
          </FormGroup>

          <FormGroup
            label={__('Description')}
            fieldId="activation-key-description"
          >
            <TextArea
              id="activation-key-description"
              value={formData.description}
              onChange={value => handleInputChange('description', value)}
              placeholder={__('Enter description (optional)')}
              rows={3}
            />
          </FormGroup>

          <FormGroup
            label={__('Usage Limit')}
            fieldId="activation-key-usage-limit"
            helperText={__('Set to -1 for unlimited usage')}
          >
            <NumberInput
              id="activation-key-usage-limit"
              value={formData.usage_limit}
              onMinus={() =>
                handleInputChange(
                  'usage_limit',
                  Math.max(-1, formData.usage_limit - 1)
                )
              }
              onPlus={() =>
                handleInputChange('usage_limit', formData.usage_limit + 1)
              }
              onChange={event => {
                const value = parseInt(event.target.value, 10);
                handleInputChange(
                  'usage_limit',
                  Number.isNaN(value) ? -1 : value
                );
              }}
              min={-1}
            />
          </FormGroup>

          <ActionGroup>
            <Button
              variant="primary"
              type="submit"
              isLoading={loading}
              ouiaId="create-activation-key-submit"
            >
              {__('Create')}
            </Button>
            <Button
              variant="link"
              onClick={handleCancel}
              ouiaId="create-activation-key-cancel"
            >
              {__('Cancel')}
            </Button>
          </ActionGroup>
        </Form>
      </div>
    </div>
  );
};

export default NewActivationKey;
