export class NewReadings {
  sample_type: any;
  sample_time: any;
  value: any;
  user_id: string;
  comment: string;
  comment_value: string = '1';
  sample_flag: number;
  sample_flag_comment: string;
  proposal_device_state: string;
  node_id: string;
  device_id: string;

  constructor(sample_type: number = 0,
              sample_time: any = '',
              value: any = '',
              user_id: string = '',
              comment: string = 'Внесение показаний',
              comment_value: string = '1',
              sample_flag: number = 20,
              sample_flag_comment: string = '',
              proposal_device_state: string = '',
              node_id: string = '',
              device_id: string = '') {
    this.sample_type = sample_type;
    this.sample_time = sample_time;
    this.value = value;
    this.user_id = user_id;
    this.comment = comment;
    this.comment_value = comment_value;
    this.sample_flag = sample_flag;
    this.sample_flag_comment = sample_flag_comment;
    this.proposal_device_state = proposal_device_state;
    this.node_id = node_id;
    this.device_id = device_id;
  }
}
