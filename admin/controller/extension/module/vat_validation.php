<?php

class ControllerExtensionModuleVatValidation extends Controller
{
    public function index()
    {
        $this->load->language('extension/module/vat_validation');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('setting/setting');

        if (($this->request->server['REQUEST_METHOD'] == 'POST')) {
            $this->model_setting_setting->editSetting('module_vat_validation', $this->request->post);

            $this->session->data['success'] = $this->language->get('text_success');

            $this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
        }

        // ... Other code for errors and breadcrumbs ...

        $data['action'] = $this->url->link('extension/module/vat_validation', 'user_token=' . $this->session->data['user_token'], true);

        if (isset($this->request->post['module_vat_validation_status'])) {
            $data['module_vat_validation_status'] = $this->request->post['module_vat_validation_status'];
        } else {
            $data['module_vat_validation_status'] = $this->config->get('module_vat_validation_status');
        }

        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_extension'),
            'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true)
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('extension/module/information', 'user_token=' . $this->session->data['user_token'], true)
        );

        $data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

        if (isset($this->request->post['module_information_status'])) {
            $data['module_information_status'] = $this->request->post['module_information_status'];
        } else {
            $data['module_information_status'] = $this->config->get('module_information_status');
        }

        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');
        $this->response->setOutput($this->load->view('extension/module/vat_validation', $data));
    }


    public function install()
    {
        $this->db->query("ALTER TABLE " . DB_PREFIX . "customer ADD COLUMN vat_number VARCHAR(10) NULL AFTER fax, ADD COLUMN doy VARCHAR(255) NULL AFTER vat_number, ADD COLUMN profession VARCHAR(255) NULL AFTER doy;");
        $this->db->query("CREATE TABLE " . DB_PREFIX . "order_invoice (order_invoice_id INT(11) AUTO_INCREMENT PRIMARY KEY, order_id INT(11) NOT NULL, vat_number VARCHAR(10) NULL, doy VARCHAR(128) NULL, profession VARCHAR(128) NULL, business_name VARCHAR(128) NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
        $this->db->query("ALTER TABLE oc_order ENGINE=InnoDB;");
        $this->db->query("ALTER TABLE " . DB_PREFIX . "order_invoice  ADD CONSTRAINT oc_order_invoice_order_id FOREIGN KEY (order_id) REFERENCES " . DB_PREFIX . "order(order_id);");
    }

    public function uninstall()
    {



    }
}












