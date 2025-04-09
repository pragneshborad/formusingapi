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
            $and_condition = " and (is_deleted = 0 OR is_deleted != 1)";

            if (!empty($post["id"])) {
                $and_condition .= " and id = ".$post["id"];
            }

            $result = $this->db->query("SELECT * FROM inquiries WHERE 1=1 $and_condition")->result_array();

            if ($result) {
                $response['success'] = 1;
                $response['data'] = $result;
            } else {
                $response['success'] = 0;
                $response['message'] = "Inquiry not found";
            }

        } else if ($action == "save") {
                // $config['upload_path']   = './assets/resumefiles'; 
                // $config['allowed_types'] = 'gif|jpg|png|webp|svg|zip|pdf|jpeg';  
                // $this->load->library('upload');
                // $this->upload->initialize($config);

            if (empty($post["name"]) || empty($post["inquiry_type"]) || empty($post["email_address"]) ||
                empty($post["contact_no"]) || empty($post["subject"]) || empty($post["comments"])
            ) {
                $response['success'] = 0;
                $response['message'] = "Field cannot be empty";
                $response['data'] = $post;
            } else {
                $time = time();

                $data = array(
                    'name' => $post["name"],
                    'inquiry_type' => $post["inquiry_type"],
                    'email_address' => $post["email_address"],
                    'contact_no' => $post["contact_no"],
                    'subject' => $post["subject"],
                    'comments' => $post["comments"],
                    'created_at' => $time
                );

                $this->db->insert("inquiries", $data);
                $last_id = $this->db->insert_id();

                if ($this->db->affected_rows() > 0) {
                    $response["success"] = 1;
                    $response["message"] = "Inquiry has been sent successfully";
                } else {
                    $response["success"] = 0;
                    $response["message"] = "Something went wrong, try again";
                }

                    // $file_fields = ['resume', 'photo', 'adhar_card'];
                    // $files_uploaded = [];

                    // foreach ($file_fields as $field) {
                    //     if ($this->upload->do_upload($field)) {
                    //         $file_data = $this->upload->data();
                    //         $files_uploaded[$field] = $file_data['file_name'];
                    //     }
                    // }
                    // if (!empty($files_uploaded)) {
                    //     $user_photo_data = [
                    //         'user_id' => $last_id,
                    //         'resume' => $files_uploaded['resume'] ?? null,
                    //         'photo' => $files_uploaded['photo'] ?? null,
                    //         'adhar_card' => $files_uploaded['adhar_card'] ?? null
                    //     ];
                    //     $this->db->insert('user_photos', $user_photo_data);
                    // }
                  $response["success"] = 1;
                    $response["message"] = "Inquiry and files saved successfully.";
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
                    $data = array(
                        'name' => $post["name"],
                        'inquiry_type' => $post["inquiry_type"],
                        'email_address' => !empty($post["email_address"]) ? $post["email_address"] : null,
                        'contact_no' => !empty($post["contact_no"]) ? $post["contact_no"] : null,
                        'subject' => !empty($post["subject"]) ? $post["subject"] : null,
                        'comments' => !empty($post["comments"]) ? $post["comments"] : null,
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