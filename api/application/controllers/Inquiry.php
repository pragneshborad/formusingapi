<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Authorization, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class Inquiry extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();

        date_default_timezone_set('Asia/Kolkata');
        $this->db->query('SET SESSION time_zone = "+05:30"');

        $this->load->model("email_model");
        $this->load->model("front_model");

       
        $postJson = file_get_contents("php://input");

        if (!empty($postJson)) {
            $decodedPost = json_decode($postJson, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decodedPost)) {
                $_POST = $decodedPost;
            }
        }

        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
    }

    public function index() {
        $this->load->view('welcome_message');
    }

    public function inquiry($action) {
        $actions = array("list", "save", "delete", "update");
        $post = $this->input->post();

        if (!in_array($action, $actions)) {
            echo json_encode(['success' => 0, 'message' => 'Request not found']);
            return;
        }

        if ($action == "list") {
            $this->load->helper('url');
            $config['upload_path']   = './assets/resumefiles/';   

            $and_condition = " and (is_deleted = 0 OR is_deleted != 1)";

            if (!empty($post["id"])) {
                $and_condition .= " and id = ".$post["id"];
            }

            $result = $this->db->query("SELECT * FROM inquiries WHERE 1=1 $and_condition")->result_array();

              if (!empty($result))  {
              foreach ($result as &$row) {
                if (!empty($row['resume'])) {

                    $resume_file = $row['resume'];
                    $file_path = FCPATH . 'assets/resumefiles/' . $resume_file;

                if (file_exists($file_path)) {
                    $row['resume_url'] = base_url('assets/resumefiles/' . $resume_file);
                } else {
                    $row['resume_url'] = null;
                    log_message('error', 'Resume file not found: ' . $file_path);
                }
            } else {
                $row['resume_url'] = null;
            }
        }
            $response['success'] = 1;
            $response['data'] = $result;
            } else {
                 $response['success'] = 0;
                $response['message'] = "Inquiry not found";
            }
        } else if ($action == "save") {
                    $time = time();
                    $no = rand(10, 100);

                    $config['upload_path'] = './assets/resumefiles/';
                    $config['allowed_types'] = 'pdf';
                    $config['file_name'] = 'resume_' . $time . '_' . $no . '.pdf';

                    $this->load->library('upload', $config);

                    $post = $this->input->post();
                    $addresses = $this->input->post('address');

                    if (empty($post["name"]) || empty($post["inquiry_type"]) || empty($post["email_address"]) || 
                        empty($post["contact_no"]) || empty($post["subject"]) || empty($addresses) || !isset($_FILES['resume'])) {
                        $response['success'] = 0;
                        $response['message'] = "Field cannot be empty";
                        $response['data'] = $post;
                    } else {
                        if (!$this->upload->do_upload('resume')) {
                            $upload_error = $this->upload->display_errors('', '');
                            $response['success'] = 0;
                            $response['message'] = strpos($upload_error, 'filetype') !== false ? "Invalid file type. Only PDF files are allowed." : ($upload_error ?: "File upload failed.");
                        } else {
                            $resume = 'resume_' . $time . '_' . $no . '.pdf';
                            $data = [
                                'name' => $post["name"],
                                'inquiry_type' => $post["inquiry_type"],
                                'email_address' => $post["email_address"],
                                'contact_no' => $post["contact_no"],
                                'subject' => $post["subject"],
                                'created_at' => $time,
                                'resume' => $resume
                            ];

                            $this->db->insert('inquiries', $data);
                        
                            $user_id = $this->db->insert_id();

                            if (!empty($addresses) && is_array($addresses)) {
                                foreach ($addresses as $address_detail) {
                                    $sql_address = [
                                        'user_id' => $user_id,
                                        'address' => $address_detail
                                    ];
                                    $this->db->insert('user_address', $sql_address);
                                }
                            }

                            if ($this->db->affected_rows() > 0) {
                                $response["success"] = 1;
                                $response["message"] = "Inquiry and file saved successfully.";
                            } else {
                                $response["success"] = 0;
                                $response["message"] = "Database error, please try again.";
                            }
                        }
                    }
                } else if ($action == "update") {
                if (empty($post["id"])) {
                $response['success'] = 0;
                $response['message'] = "ID is required";
            } else {
                $id = $post["id"];
                $this->db->where("id", $id);
                $current_record = $this->db->get("inquiries")->row_array();

                if ($current_record && isset($current_record['is_deleted']) && ($current_record['is_deleted'] == 1)) {
                    $response['success'] = 0;
                    $response['message'] = "This inquiry has been deleted and cannot be updated.";
                } else {
                    $time = time();

                    $data = array(
                        'name' => $post["name"],
                        'inquiry_type' => $post["inquiry_type"],
                        'email_address' => !empty($post["email_address"]) ? $post["email_address"] : null,
                        'contact_no' => !empty($post["contact_no"]) ? $post["contact_no"] : null,
                        'subject' => !empty($post["subject"]) ? $post["subject"] : null,
                        'address' => !empty($post["Address"]) ? $post["Address"] : null,
                        'updated_at' => $time
                    );


                    $this->db->where("id", $id);
                    $this->db->update("inquiries", $data);

                    if ($this->db->affected_rows() > 0) {
                        $response["success"] = 1;
                        $response["message"] = "Inquiry has been updated successfully";
                    } else {
                        $response["success"] = 0;
                        $response["message"] = "No changes were made";
                    }
                }
            }

        } else if ($action == "delete") {
            if (empty($post["id"])) {
                $response['success'] = 0;
                $response['message'] = "ID is required";
            } else {
                $time = time();
                $id = $post["id"];

                $data = array(
                    'deleted_at' => $time,
                    'is_deleted' => 1
                );

                $this->db->where("id", $id);
                $this->db->update("inquiries", $data);

                if ($this->db->affected_rows() > 0) {
                    $response["success"] = 1;
                    $response["message"] = "Inquiry has been deleted successfully";
                } else {
                    $response["success"] = 0;
                    $response["message"] = "Inquiry not found or no changes made";
                }
            }
        }

        echo json_encode($response);
        die;
    }
}