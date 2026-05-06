// Script để cập nhật explanationVi - Batch 3
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 3 - 50 câu tiếp theo
const translations = {
  "menkyogentsuki_gentsuki_9_12_1": "Biển báo này cho biết có vạch an toàn.",
  "menkyogentsuki_gentsuki_9_12_2": "Khi xe phía sau bắt đầu vượt xe, không được vượt xe.",
  "menkyogentsuki_gentsuki_9_12_3": "Biển báo này là biển cấm lưu thông, người đi bộ và xe điện đường phố đều không được lưu thông.",
  "menkyogentsuki_gentsuki_9_12_4": "Khi cảm thấy buồn ngủ hoặc mệt mỏi khi lái xe, cần ngừng lái xe ngay lập tức và nghỉ ngơi.",
  "menkyogentsuki_gentsuki_9_12_5": "Sai. Ở nơi có biển 'Bấm còi' không chỉ khi đi qua ngã tư không có tầm nhìn, đường cong, đỉnh dốc mà phải 'luôn luôn' bấm còi, nên là sai.",
  "menkyogentsuki_gentsuki_9_13_1": "Biển báo này cho biết kết thúc của biển báo chính.",
  "menkyogentsuki_gentsuki_9_13_2": "Dù không có vỉa hè hay làn đường bên đường, xe gắn máy vẫn phải đi ở phía trái nhất của đường.",
  "menkyogentsuki_gentsuki_9_13_3": "Vì làm chói mắt người lái xe đối diện, nên hạ đèn xuống hoặc giảm độ sáng.",
  "menkyogentsuki_gentsuki_9_13_4": "Ở nơi có biển bấm còi, phải luôn bấm còi.",
  "menkyogentsuki_gentsuki_9_13_5": "Vì để tránh làm phân tâm người lái xe phía trước.",
  "menkyogentsuki_gentsuki_9_14_1": "Khi không quay lái và bánh xe không nghiêng, khi phanh xe hai bánh thì nên phanh cả bánh trước và bánh sau cùng lúc.",
  "menkyogentsuki_gentsuki_9_14_2": "Mô tả trong đề bài là đúng. Ở bến xe không có vạch an toàn, phải dừng lại phía sau và đợi.",
  "menkyogentsuki_gentsuki_9_14_3": "Ngoại trừ ngã tư cấm quay đầu, quay đầu không bị cấm khi có tín hiệu mũi tên rẽ phải.",
  "menkyogentsuki_gentsuki_9_14_4": "Nếu vì phòng ngừa nguy hiểm thì có thể đi vào làn đường dành riêng cho xe buýt.",
  "menkyogentsuki_gentsuki_9_14_5": "Đúng. Ngoài ra, tín hiệu bằng tay phải giơ ngang là tín hiệu rẽ phải.",
  "menkyogentsuki_gentsuki_9_15_1": "Xe mô tô hai bánh không có xe sidecar được coi là người đi bộ khi tắt máy và đẩy đi. Do đó, có thể đi trên vỉa hè.",
  "menkyogentsuki_gentsuki_9_15_2": "Nếu không phải với mục đích vận chuyển hành khách hay lái xe thay, thì có thể lái taxi bằng bằng lái xe hạng nhất thông thường.",
  "menkyogentsuki_gentsuki_9_15_3": "Ở đường bộ nhỏ có đèn tín hiệu mà đèn tín hiệu cho thấy màu xanh, thì không cần dừng lại mà chỉ cần kiểm tra trái phải.",
  "menkyogentsuki_gentsuki_9_15_4": "Nếu có thể giữ khoảng cách an toàn thì không cần phải chạy chậm.",
  "menkyogentsuki_gentsuki_9_15_5": "Nếu có thể giữ khoảng cách an toàn thì không cần phải chạy chậm.",
  "menkyogentsuki_gentsuki_9_16_1": "Với bằng xe máy (Gentsuki), bạn chỉ có thể lái xe gắn máy.",
  "menkyogentsuki_gentsuki_9_16_2": "Sẽ bị coi là lái xe không có giấy phép.",
  "menkyogentsuki_gentsuki_9_16_3": "Vì xe gắn máy có thể mất thăng bằng và bị lật, nên cần phải học kỹ thuật lái phù hợp.",
  "menkyogentsuki_gentsuki_9_16_4": "Khi xe bị xẹp lốp mà phanh gấp thì rất nguy hiểm. Nắm chắc tay lái và phanh từ từ, ngắt quãng.",
  "menkyogentsuki_gentsuki_9_16_5": "Hãy luôn chú ý lái xe an toàn.",
  "menkyogentsuki_gentsuki_9_17_1": "Mô tả trong đề bài là đúng. Ở bến xe không có vạch an toàn, phải dừng lại phía sau và đợi.",
  "menkyogentsuki_gentsuki_9_17_2": "Phanh nhiều lần, giảm tốc độ và sử dụng phanh động cơ. Nếu vẫn không dừng được thì đâm vào cát, đất... để dừng xe.",
  "menkyogentsuki_gentsuki_9_17_3": "Biển báo này cho biết tốc độ tối đa là 30 km/h.",
  "menkyogentsuki_gentsuki_9_17_4": "Biển báo này cho biết vạch dừng, thể hiện vị trí dừng khi dừng xe.",
  "menkyogentsuki_gentsuki_9_17_5": "Việc đi qua làn đường bên đường hay vỉa hè để vào cơ sở tiếp giáp với đường không bị cấm. Bất kể có người đi bộ hay không, phải luôn dừng lại, xác nhận an toàn rồi mới đi qua.",
  "menkyogentsuki_gentsuki_9_18_1": "Trong phạm vi đường bộ nhỏ và 30 mét trước đó không được vượt xe.",
  "menkyogentsuki_gentsuki_9_18_2": "Bất kể có tự tin vào khả năng lái xe hay không, để phòng ngừa tai nạn bất ngờ, phải tham gia bảo hiểm bắt buộc.",
  "menkyogentsuki_gentsuki_9_18_3": "Là sự chênh lệch quỹ đạo giữa bánh trước và bánh sau ở phía trong khi quay lái.",
  "menkyogentsuki_gentsuki_9_18_4": "Đúng. Theo Điều 53 Khoản 1 Luật Giao thông đường bộ 'phải tiếp tục phát tín hiệu cho đến khi hoàn thành hành động rẽ phải/trái'.",
  "menkyogentsuki_gentsuki_9_18_5": "Ngay cả khi vượt xe, cũng không được vượt quá tốc độ tối đa.",
  "menkyogentsuki_gentsuki_9_19_1": "Dù lái xe khi mang theo giấy phép đã hết hiệu lực thì vẫn bị coi là lái xe không phép.",
  "menkyogentsuki_gentsuki_9_19_2": "Khi có người đi bộ trên vạch an toàn thì phải chạy chậm.",
  "menkyogentsuki_gentsuki_9_19_3": "Trong hầm đường bộ, cấm đỗ xe, dừng xe bất kể có làn đường hay không.",
  "menkyogentsuki_gentsuki_9_19_4": "Khi có bằng đặc biệt hạng nặng, bạn có thể lái xe đặc biệt hạng nặng, xe đặc biệt hạng nhẹ và xe gắn máy.",
  "menkyogentsuki_gentsuki_9_19_5": "Đối với giao thông hướng về phía có người cảnh sát đối diện, luôn là tín hiệu đèn màu đỏ.",
  "menkyogentsuki_gentsuki_9_20_1": "Dừng xe để người lên xuống là dừng xe.",
  "menkyogentsuki_gentsuki_9_20_2": "Vì vào ngày mưa, khoảng cách phanh dài hơn.",
  "menkyogentsuki_gentsuki_9_20_3": "Ra tín hiệu bằng đèn báo rẽ phải trước 30 mét từ điểm muốn quay đầu.",
  "menkyogentsuki_gentsuki_9_20_4": "Bằng xe máy chỉ có thể lái xe gắn máy.",
  "menkyogentsuki_gentsuki_9_20_5": "Việc có thể dựng chân chống giữa trên mặt đất bằng phẳng cũng là một yếu tố quan trọng."
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
