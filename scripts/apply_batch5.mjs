// Script để cập nhật explanationVi - Batch 5
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 5
const translations = {
  "menkyogentsuki_gentsuki_9_27_1": "Để tránh bánh xe rơi xuống đường ray, đi gần giữa đường nhất có thể.",
  "menkyogentsuki_gentsuki_9_27_2": "Đúng. Khi đang đi với tốc độ dưới 30 km/h, nên giữ khoảng cách an toàn tối thiểu bằng một nửa giá trị tốc độ (đơn vị: mét). Do đó, xe đang đi với tốc độ 20 km/h cần giữ khoảng cách tối thiểu 10 mét.",
  "menkyogentsuki_gentsuki_9_27_3": "Đúng. Ngoài ra, giới hạn chiều rộng trái phải là 0,15 mét từ thùng xe.",
  "menkyogentsuki_gentsuki_9_27_5": "Bộ chỉ thị trượt còn được gọi là thước đo trượt/slip gauge hoặc slip indicator.",
  "menkyogentsuki_gentsuki_9_28_1": "Để phát hiện nguy hiểm và có thể tránh được, hãy nhìn xa nhất có thể, không tập trung vào một điểm.",
  "menkyogentsuki_gentsuki_9_28_2": "Khoảng cách từ khi phanh đến khi bánh xe bắt đầu quay là khoảng cách không tải, khoảng cách từ khi phanh đến khi xe dừng là khoảng cách phanh. Tổng của hai khoảng cách đó gọi là khoảng cách dừng.",
  "menkyogentsuki_gentsuki_9_28_3": "Không chỉ quy tắc giao thông, mà còn phải biết tính cách và thói quen của mình, và chú ý lái xe để bù đắp cho chúng.",
  "menkyogentsuki_gentsuki_9_28_4": "Vạch kẻ đường giữa có thể không ở chính giữa đường.",
  "menkyogentsuki_gentsuki_9_28_5": "Dung dịch pin bay hơi nên giảm, vì vậy phải kiểm tra.",
  "menkyogentsuki_gentsuki_9_29_1": "Biển báo này cấm xe (kết hợp) lưu thông, xe gắn máy cũng không thể lưu thông.",
  "menkyogentsuki_gentsuki_9_29_2": "Tốc độ tối đa của xe gắn máy là 30 km/h.",
  "menkyogentsuki_gentsuki_9_29_3": "Khi có vạch an toàn, ngay cả khi đang đón/trả khách vẫn có thể chạy chậm để tiến vào.",
  "menkyogentsuki_gentsuki_9_29_4": "Khi phanh chân bị hỏng, hãy thử dừng xe bằng phanh động cơ.",
  "menkyogentsuki_gentsuki_9_29_5": "Nếu chiều dài nhô ra phía sau thùng xe dưới 0,3 mét thì có thể xếp hàng hóa nhô ra phía sau.",
  "menkyogentsuki_gentsuki_9_30_1": "Biển báo này cho biết có nguy cơ đá rơi.",
  "menkyogentsuki_gentsuki_9_30_2": "Sẽ bị coi là vi phạm giao thông không mang giấy phép.",
  "menkyogentsuki_gentsuki_9_30_3": "Biển báo này cho biết lệnh cấm quay đầu kết thúc tại đây.",
  "menkyogentsuki_gentsuki_9_30_4": "Để tránh trượt, đi theo vết bánh xe nhất có thể.",
  "menkyogentsuki_gentsuki_9_30_5": "Có thể chạy chậm để tiến vào, hoặc trong một số trường hợp thì dừng lại.",
  "menkyogentsuki_gentsuki_10_3_1": "Nếu làn đường bên đường rộng hơn 0,75 mét thì có thể đi vào làn đường bên đường để đỗ xe, nhưng vì người đi bộ lưu thông nên cần chừa ít nhất 0,75 mét.",
  "menkyogentsuki_gentsuki_10_3_2": "Biển báo này cho biết cấm xe mô tô lớn và xe mô tô phổ thông chở 2 người. Tuy nhiên, xe gắn máy bị cấm chở 2 người bất kể có biển báo này hay không.",
  "menkyogentsuki_gentsuki_10_3_3": "Ngay cả khi vượt xe, cũng không được vượt quá tốc độ pháp định.",
  "menkyogentsuki_gentsuki_10_3_4": "Đúng. Khi rẽ phải tại ngã tư, phải rẽ phải ở gần giữa đường từ trước. Đó là để xe đi thẳng dễ đi qua hơn.",
  "menkyogentsuki_gentsuki_10_3_5": "Xe hai bánh dễ bị người lái xe bốn bánh bỏ sót.",
  "menkyogentsuki_gentsuki_10_4_1": "Lái xe mà không có giấy phép phù hợp với loại xe đó là lái xe không có giấy phép.",
  "menkyogentsuki_gentsuki_10_4_2": "Để tránh tai nạn cuốn vào, việc xác nhận an toàn là rất quan trọng.",
  "menkyogentsuki_gentsuki_10_4_3": "Đúng. Ngoài ra, gậy trắng cũng như gậy vàng là vật dụng của người khiếm thị, vì vậy cũng cần chạy chậm v.v.",
  "menkyogentsuki_gentsuki_10_4_4": "Lái xe với tinh thần nhường nhịn và thấu hiểu.",
  "menkyogentsuki_gentsuki_10_4_5": "Dừng xe là việc dừng xe trong thời gian ngắn không được coi là đỗ xe, nếu vượt quá thì là đỗ xe.",
  "menkyogentsuki_gentsuki_10_5_1": "Các phương tiện bao gồm xe đạp nhẹ, theo nguyên tắc không được lưu thông trên vỉa hè. Do đó, ngay cả xe đạp nhẹ cũng không thể đi trên vỉa hè theo nguyên tắc.",
  "menkyogentsuki_gentsuki_10_5_2": "Biển báo này là biển cấm đi theo hướng khác ngoài hướng chỉ định, cấm đi thẳng và rẽ phải.",
  "menkyogentsuki_gentsuki_10_5_3": "Xe hai bánh giữ thăng bằng bằng cơ thể đòi hỏi kỹ thuật lái khác với xe bốn bánh.",
  "menkyogentsuki_gentsuki_10_5_4": "Không đi vào vạch qua đường cho người đi bộ, dừng lại.",
  "menkyogentsuki_gentsuki_10_5_5": "Đi sát vào và chèn vào bị cấm, nhưng vượt xe và tách xe không bị cấm.",
  "menkyogentsuki_gentsuki_10_6_1": "Biển cấm quay đầu. Biển báo này không bao gồm ý nghĩa cấm lùi.",
  "menkyogentsuki_gentsuki_10_6_2": "Khi lên dốc, xe khó đi lên hơn.",
  "menkyogentsuki_gentsuki_10_6_3": "Dừng ở vạch dừng, không phải trước vạch qua đường cho người đi bộ.",
  "menkyogentsuki_gentsuki_10_6_4": "Đúng. Ngoài ra, khi khởi hành cần khởi hành từ từ.",
  "menkyogentsuki_gentsuki_10_6_5": "Nếu không có người trên vạch an toàn thì không cần chạy chậm. Nếu có người thì chạy chậm để đi qua."
};

function updateData(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if (item.id && translations[item.id] !== undefined) {
          item.explanationVi = translations[item.id];
          console.log(`✓ ${item.id}`);
        }
      }
      updateData(item);
    }
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      updateData(obj[key]);
    }
  }
}

updateData(data);
fs.writeFileSync('app/data/questions.vi.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('\nĐã cập nhật 50 câu!');
