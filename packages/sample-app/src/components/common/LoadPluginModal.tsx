import { usePluginStore } from '@openshift/dynamic-plugin-sdk';
import { Button, Modal, Text, TextContent, TextInput } from '@patternfly/react-core';
import * as React from 'react';
import { isValidURL } from '../../utils';

const isValidPluginBaseURL = (value: string) => isValidURL(value) && value.endsWith('/');

type LoadPluginModalProps = {
  defaultBaseURL?: string;
};

export type LoadPluginModalRefProps = {
  open: VoidFunction;
};

const LoadPluginModal = React.forwardRef<LoadPluginModalRefProps, LoadPluginModalProps>(
  ({ defaultBaseURL = 'http://localhost:9001/' }, ref) => {
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [baseURL, setBaseURL] = React.useState(defaultBaseURL);
    const [baseURLValid, setBaseURLValid] = React.useState(isValidPluginBaseURL(defaultBaseURL));

    const pluginStore = usePluginStore();

    const onBaseURLChange = React.useCallback(
      (value: string) => {
        setBaseURL(value);
        setBaseURLValid(isValidPluginBaseURL(value));
      },
      [setBaseURL, setBaseURLValid],
    );

    const openModal = React.useCallback(() => {
      setModalOpen(true);
    }, [setModalOpen]);

    const closeModal = React.useCallback(() => {
      setModalOpen(false);
    }, [setModalOpen]);

    const loadPlugin = React.useCallback(() => {
      pluginStore.loadPlugin(baseURL);
      closeModal();
    }, [baseURL, pluginStore, closeModal]);

    React.useImperativeHandle(
      ref,
      () => ({
        open: openModal,
      }),
      [openModal],
    );

    return (
      <Modal
        variant="small"
        title="Load plugin"
        showClose={false}
        isOpen={isModalOpen}
        onClose={closeModal}
        actions={[
          <Button key="load" variant="primary" onClick={loadPlugin} isDisabled={!baseURLValid}>
            Load
          </Button>,
          <Button key="cancel" variant="link" onClick={closeModal}>
            Cancel
          </Button>,
        ]}
      >
        <TextContent>
          <Text component="p">Load a plugin from the provided URL address.</Text>
        </TextContent>
        <TextInput
          type="text"
          isRequired
          value={baseURL}
          onChange={onBaseURLChange}
          validated={baseURLValid ? 'success' : 'error'}
          aria-label="Plugin base URL"
        />
      </Modal>
    );
  },
);

export default LoadPluginModal;
