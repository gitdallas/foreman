import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import BreadcrumbBar from '../BreadcrumbBar';

const ActivationKeyDetails = () => {
  const { id } = useParams();
  const [activationKey, setActivationKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState('info');

  useEffect(() => {
    const fetchActivationKey = async () => {
      try {
        const response = await fetch(`/katello/api/activation_keys/${id}`);
        const data = await response.json();
        setActivationKey(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching activation key:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivationKey();
  }, [id]);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  if (loading) {
    return <div>{__('Loading...')}</div>;
  }

  if (!activationKey) {
    return <div>{__('Activation Key not found')}</div>;
  }

  const breadcrumbItems = [
    { caption: __('Activation Keys'), url: '/activation_keys' },
    { caption: activationKey.name, url: `/activation_keys/${id}` },
  ];

  return (
    <div>
      <BreadcrumbBar
        breadcrumbItems={breadcrumbItems}
        switcherItemUrl="/activation_keys"
      />

      <div className="activation-key-details">
        <h1>{activationKey.name}</h1>

        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
          ouiaId="activation-key-details-tabs"
        >
          <Tab
            eventKey="info"
            title={<TabTitleText>{__('Details')}</TabTitleText>}
            ouiaId="activation-key-info-tab"
          >
            <div className="activation-key-info">
              <div className="detail-row">
                <strong>{__('Name')}:</strong> {activationKey.name}
              </div>
              <div className="detail-row">
                <strong>{__('Description')}:</strong>{' '}
                {activationKey.description || __('None')}
              </div>
              <div className="detail-row">
                <strong>{__('Usage Limit')}:</strong>{' '}
                {activationKey.usage_limit === -1
                  ? __('Unlimited')
                  : activationKey.usage_limit}
              </div>
              <div className="detail-row">
                <strong>{__('Environment')}:</strong>{' '}
                {activationKey.environment?.name || __('None')}
              </div>
              <div className="detail-row">
                <strong>{__('Content View')}:</strong>{' '}
                {activationKey.content_view?.name || __('None')}
              </div>
            </div>
          </Tab>

          <Tab
            eventKey="subscriptions"
            title={<TabTitleText>{__('Subscriptions')}</TabTitleText>}
            ouiaId="activation-key-subscriptions-tab"
          >
            <div>{__('Subscriptions content will be implemented here')}</div>
          </Tab>

          <Tab
            eventKey="host-collections"
            title={<TabTitleText>{__('Host Collections')}</TabTitleText>}
            ouiaId="activation-key-host-collections-tab"
          >
            <div>{__('Host Collections content will be implemented here')}</div>
          </Tab>

          <Tab
            eventKey="content-hosts"
            title={<TabTitleText>{__('Content Hosts')}</TabTitleText>}
            ouiaId="activation-key-content-hosts-tab"
          >
            <div>{__('Content Hosts content will be implemented here')}</div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ActivationKeyDetails;
