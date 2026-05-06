// Script để cập nhật explanationVi cho scenarioGroups và dangerScenarioGroups
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Translations cho scenarioGroups và dangerScenarioGroups
const translations = {
  // Scenario groups
  "二輪車はカーブでバランスを崩し、転倒しやすいため注意が必要である。": "Xe hai bánh dễ mất thăng bằng và bị lật ở đường cong, nên cần chú ý.",
  "カーブは追い越し禁止である。": "Đường cong là nơi cấm vượt xe.",
  "カーブでは速度を上げるのは危険である。": "Tăng tốc ở đường cong là nguy hiểm.",
  "踏切の安全確認は、必ず自分で行う。": "Xác nhận an toàn đường bộ nhỏ phải do chính mình thực hiện.",
  "踏切の安全確認は、自分の目と耳で必ず行う。": "Xác nhận an toàn đường bộ nhỏ phải bằng mắt và tai mình.",
  "踏切の端に近い部分を走行すると、脱輪のおそれがある。": "Đi gần mép đường bộ nhỏ có thể bị lệch bánh.",
  "歩行者に雨水や泥をかけるような運転をしてはならない。": "Không được lái xe làm bắn nước mưa và bùn lên người đi bộ.",
  "雨の日は、雨音のせいで歩行者が車の接近に気付かないことがある。": "Ngày mưa, có thể người đi bộ không nhận ra xe đến gần vì tiếng mưa.",
  "雨の日の歩行者は、視線を下に落とすことが多いため、車の接近に気付きにくい。": "Người đi bộ ngày mưa thường nhìn xuống nên khó nhận ra xe đến gần.",
  "交差点は横断歩行者が優先である。また、トラックに巻き込まれる危険もある。": "Tại ngã tư, người đi bộ qua đường có quyền ưu tiên. Ngoài ra, cũng có nguy cơ bị cuốn vào xe tải.",
  "トラックの内輪差のために、巻き込まれるおそれがある。": "Vì bán kính quay vòng trong của xe tải, có thể bị cuốn vào.",
  "トラックは歩行者に気づいて停止したかもしれない。たとえトラックが停止し、進路が確保されたとしても、ちゃんと安全を確認して左折する。": "Xe tải có thể đã dừng vì nhận ra người đi bộ. Dù xe tải đã dừng và đường đã thông, vẫn phải xác nhận an toàn rồi mới rẽ trái.",
  "横断歩行者が優先である。歩行者が止まるだろうと考えてはならない。": "Người đi bộ qua đường có quyền ưu tiên. Không được nghĩ rằng người đi bộ sẽ dừng lại.",
  "死角となって見えない二輪車が直進してくることがありえる。": "Xe hai bánh có thể đi thẳng từ vùng khuất.",
  "交差点を進行するときは、安全を確認し、徐行して進行する。": "Khi đi qua ngã tư, xác nhận an toàn và chạy chậm để tiến vào.",
  "対向車や前車の視界を奪うことになるため、ライトは下向きで進行する。": "Vì làm che tầm nhìn của xe đối diện và xe phía trước, nên đi với đèn hướng xuống.",
  "対向車の陰から二輪車が進行してくる可能性などがある。": "Xe hai bánh có thể đi từ bóng của xe đối diện.",
  "横断歩行者が優先である。": "Người đi bộ qua đường có quyền ưu tiên.",
  "工事現場付近では、作業員の飛び出しに注意する。": "Gần công trường xây dựng, chú ý công nhân bất ngờ chạy ra.",
  "急ブレーキは危険である。": "Phanh gấp là nguy hiểm.",
  "車線を変更する際は、目視での確認も必要である。": "Khi thay đổi làn đường, cũng cần xác nhận bằng mắt.",
  "対向車の車線が工事中で通行できないためである。": "Vì làn đường đối diện đang thi công nên không thể đi được.",
  "人の飛び出しや機材との接触など、危険があるためである。": "Vì có nguy hiểm như người bất ngờ chạy ra hoặc va chạm với thiết bị.",
  "横断するかどうかは分からず、また仮に横断する場合、歩行者優先である。": "Không biết có qua đường hay không, và nếu có qua đường thì người đi bộ có quyền ưu tiên.",
  "不意にどこかから小さな子どもが飛び出すこともあり、注意が必要である。": "Trẻ nhỏ có thể bất ngờ chạy ra từ đâu đó, cần chú ý.",
  "不意に道路を横断する、歩行者を避けて自車の前方に飛び出すといったこともある。": "Có thể có người bất ngờ qua đường hoặc nhảy ra phía trước xe để tránh người đi bộ.",
  "急な上り坂の頂上付近は徐行せねばならない。": "Gần đỉnh dốc lên dốc phải chạy chậm.",
  "急な上り坂の頂上付近では、坂の先が見えないため、注意が必要である。": "Gần đỉnh dốc lên dốc không nhìn thấy phía trước dốc, nên cần chú ý.",
  "後続車がいたとしても、急な上り坂の頂上付近は徐行せねばならない。": "Dù có xe phía sau, gần đỉnh dốc lên dốc vẫn phải chạy chậm.",
  "Ｔ字路になっている。": "Đường thành hình chữ T.",
  "トラックの陰にいる人が見えなくなっているため、注意が必要である。": "Người đứng trong bóng xe tải có thể không nhìn thấy, cần chú ý.",
  "子どもは予測できない動きをすることがある。": "Trẻ em có thể có hành động không thể đoán trước.",
  "みだりに警音器を使用してはならない。": "Không được tùy tiện sử dụng còi.",
  "遊んでいる最中の子どもは、特に不意に行動することがある。": "Trẻ đang chơi có thể hành động bất ngờ.",
  "雨の日の子どもは、視線を下に落とすことが多く、車の接近に気付きにくい。": "Trẻ em ngày mưa thường nhìn xuống nên khó nhận ra xe đến gần.",
  "雨の日はブレーキが利きづらい。住宅街で速度を上げて運転することは危険である。": "Ngày mưa phanh kém hiệu quả. Tăng tốc trong khu dân cư là nguy hiểm.",
  "警音器鳴らせの標識があるため、警音器を鳴らさねばならない。": "Vì có biển bấm còi nên phải bấm còi.",
  "工事現場に隠れて対向車が見えなくなっている可能性もあるため、注意する。": "Xe đối diện có thể bị khuất sau công trường, cần chú ý.",
  "交差点では、横断歩行者が優先である。歩行者が止まるだろうを考えてはならない。": "Tại ngã tư, người đi bộ qua đường có quyền ưu tiên. Không được nghĩ rằng người đi bộ sẽ dừng lại.",
  "交差点では、横断歩行者が優先である。": "Tại ngã tư, người đi bộ qua đường có quyền ưu tiên.",
  "みだりに警音器を鳴らしてはいけない。": "Không được tùy tiện bấm còi.",
  "この場合、原則として対向車が優先される。": "Trong trường hợp này, nguyên tắc là xe đối diện có quyền ưu tiên.",
  "対向車と衝突してしまう危険があるためである。": "Vì có nguy cơ đâm vào xe đối diện.",
  "カーブで速度を上げるのは危険である。": "Tăng tốc ở đường cong là nguy hiểm.",
  "駐車車両から人が降りてきたり、駐車車両の陰から人が飛び出したりするおそれがある。": "Người có thể xuống xe đỗ hoặc chạy ra từ bóng xe đỗ.",
  "交差点内で停止すると危険であり、他の交通の迷惑にもなる。": "Dừng trong ngã tư nguy hiểm và cản trở phương tiện khác.",
  "先の状況が分からないときは、交差点へ進入しない。": "Khi không biết tình hình phía trước, không đi vào ngã tư.",
  "渋滞中の道路で追い越しをするのは危険である。": "Vượt xe trên đường kẹt là nguy hiểm.",
  "左カーブでは、対向車に衝突せぬよう、少し左に寄って走行する。": "Ở đường cong trái, đi sát bên trái một chút để tránh đâm xe đối diện.",
  "カーブでは、速度を落として進行する。": "Ở đường cong, giảm tốc độ để tiến vào.",
  "カーブでは、対向車と衝突するよりおそれがあるので、センターラインに寄って進行してはならない。": "Ở đường cong có nguy cơ đâm xe đối diện, không được đi gần vạch giữa.",
  "子どもは予測できない動きをするため、注意が必要である。": "Trẻ em có thể hành động không thể đoán trước, cần chú ý.",
  "対向車が通りすぎるのを待つ必要がある。": "Cần đợi xe đối diện đi qua.",
  "後続車がいるからスタート、急いで右折する必要はない。": "Dù có xe phía sau cũng không cần vội vàng rẽ phải.",
  "対向車との衝突事故の原因となりうるので、安全を確認してから車線変更する。": "Có thể gây tai nạn đâm xe đối diện, nên xác nhận an toàn rồi mới thay đổi làn đường.",
  "安全のために、対向車の通過を待つことは望ましい。": "Vì an toàn, nên đợi xe đối diện đi qua.",
  "タクシーの方向指示器にも注目しておく必要がある。": "Cũng cần chú ý đèn báo rẽ của taxi.",
  "踏切の安全確認は、窓を開け、自分の目と耳で必ず行う。": "Xác nhận an toàn đường bộ nhỏ phải mở cửa sổ, bằng mắt và tai mình.",
  "できるだけ踏切の中央寄りを走行する。": "Đi gần giữa đường bộ nhỏ nhất có thể.",
  "駐車车辆的陰から人が飛び出すことは多い。": "Người thường chạy ra từ bóng xe đỗ.",
  "急いな車線の変更は危険である。": "Thay đổi làn đường đột ngột là nguy hiểm."
};

function updateSubs(subs) {
  if (Array.isArray(subs)) {
    for (const sub of subs) {
      if (sub && typeof sub === 'object' && sub.explanation && sub.explanationVi === null) {
        const key = sub.explanation.trim();
        if (translations[key]) {
          sub.explanationVi = translations[key];
          console.log(`✓ Đã dịch: ${key.slice(0, 30)}...`);
        }
      }
    }
  }
}

if (data.scenarioGroups) {
  for (const group of data.scenarioGroups) {
    if (group.subs) updateSubs(group.subs);
  }
}

if (data.dangerScenarioGroups) {
  for (const group of data.dangerScenarioGroups) {
    if (group.subs) updateSubs(group.subs);
  }
}

fs.writeFileSync('app/data/questions.vi.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('\nĐã cập nhật scenario groups!');
