import { CampusLocation, ClubActivity, AdmissionInfo, Quest } from '../types/campus';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'gate',
    name: 'School Gate & Monument',
    vietnameseName: 'Cổng Trường & Tượng Đài Hàn Thuyên',
    category: 'gate',
    position: [0, 0, 48],
    rotation: 0,
    size: [14, 6, 4],
    icon: 'DoorOpen',
    shortDescription: 'Cổng chính bề thế với bảng tên đỏ chữ vàng cùng tượng đài danh nhân văn hóa Hàn Thuyên.',
    fullDescription: 'Cổng chính Trường THPT Hàn Thuyên nổi bật với kiến trúc vòm trang trọng, rợp bóng râm của hai hàng cây cổ thụ. Ngay bên phải cổng là tượng đài và văn bia kỷ niệm danh sĩ Hàn Thuyên (Nguyễn Thuyên) - người tiên phong đưa chữ Nôm vào văn học dân tộc thời nhà Trần, biểu tượng cho truyền thống hiếu học và lòng tự tôn văn hóa của thầy và trò nhà trường.',
    highlights: [
      'Bảng tên trường đắp nổi sơn thếp vàng rực rỡ',
      'Khuôn viên tượng đài danh nhân Hàn Thuyên',
      'Hệ thống cổng tự động và phòng thường trực an ninh 24/7',
      'Bảng tin điện tử thông báo lịch học và thành tích học sinh'
    ],
    specs: {
      area: '180 m²',
      capacity: 'Lưu lượng 2.000 học sinh/giờ tan trường',
      floor: 'Tầng trệt',
      equipment: 'Camera AI nhận diện, barie thông minh, bốt bảo vệ'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Toàn cảnh cổng trường THPT Hàn Thuyên buổi sáng khai giảng rộn rã cờ hoa'
  },
  {
    id: 'block-a',
    name: 'Academic Block A',
    vietnameseName: 'Dãy Phòng Học A (Khối 10 & 11)',
    category: 'academic',
    position: [-28, 0, 10],
    rotation: Math.PI / 2,
    size: [12, 10, 40],
    icon: 'BookOpen',
    shortDescription: 'Dãy phòng học 3 tầng kiên cố, thoáng mát, phục vụ học sinh các khối 10 và 11.',
    fullDescription: 'Dãy nhà A được xây dựng theo phong cách kiến trúc trường học miền Nam truyền thống pha lẫn hiện đại: tường vàng kem dịu mắt, hành lang rộng 2.5m thông thoáng hứng gió trời, ban công phủ dây leo xanh mát. Tất cả các phòng học đều trang bị máy chiếu tương tác, điều hòa nhiệt độ, bảng trượt thông minh chống lóa và hệ thống âm thanh giảng dạy hiện đại.',
    highlights: [
      '24 phòng học tiêu chuẩn đạt chuẩn quốc gia',
      'Trang bị máy lạnh Inverter, màn hình tương tác thông minh 75 inch',
      'Góc xanh hành lang do chính học sinh tự tay chăm sóc',
      'Tủ đồ cá nhân (locker) tiện lợi cho từng học sinh'
    ],
    specs: {
      area: '1.450 m²',
      capacity: '1.200 học sinh',
      floor: '3 tầng (Trệt, Lầu 1, Lầu 2)',
      equipment: 'Máy chiếu tương tác, camera lớp học, quạt trần, máy lạnh'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Hành lang dãy A ngập tràn ánh nắng và các lớp học trang bị hiện đại'
  },
  {
    id: 'block-b',
    name: 'Academic Block B',
    vietnameseName: 'Dãy Phòng Học B (Khối 12 & Luyện Thi)',
    category: 'academic',
    position: [28, 0, 10],
    rotation: -Math.PI / 2,
    size: [12, 10, 40],
    icon: 'GraduationCap',
    shortDescription: 'Không gian học tập chuyên sâu của các anh chị khối 12 với tinh thần quyết tâm cao độ.',
    fullDescription: 'Dãy nhà B là trung tâm ôn luyện và học tập chuyên sâu của khối 12 trong chặng đường chinh phục kỳ thi Tốt nghiệp THPT và Xét tuyển Đại học. Phòng học cách âm tốt, có phòng tự học yên tĩnh mở cửa tới 18h30 hàng ngày, cùng bảng vàng thành tích thủ khoa, á khoa các năm để truyền cảm hứng mạnh mẽ cho sĩ tử.',
    highlights: [
      'Khu vực phòng tự học có giảng viên hướng dẫn',
      'Bảng vinh danh thủ khoa Đại học qua các thời kỳ',
      'Không gian tư vấn hướng nghiệp và tâm lý học đường',
      'Wifi tốc độ cao phủ sóng toàn dãy'
    ],
    specs: {
      area: '1.450 m²',
      capacity: '1.100 học sinh',
      floor: '3 tầng',
      equipment: 'Bảng tương tác, điều hòa 2 chiều, dàn loa hội trường nhỏ'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Lớp học khối 12 với không khí học tập trung và bảng hướng nghiệp'
  },
  {
    id: 'block-c',
    name: 'Academic Block C',
    vietnameseName: 'Dãy Phòng Học C & Phòng Bộ Môn',
    category: 'academic',
    position: [0, 0, -32],
    rotation: 0,
    size: [48, 10, 12],
    icon: 'Palette',
    shortDescription: 'Tòa nhà bộ môn Âm nhạc, Mỹ thuật, Ngoại ngữ, và Giáo dục Quốc phòng - An ninh.',
    fullDescription: 'Dãy nhà C nằm ở phía sau khuôn viên, kết nối trực tiếp với khu thể thao và thư viện. Nơi đây quy tụ các phòng bộ môn chuyên biệt: phòng học Ngoại ngữ đa phương tiện với tai nghe chuẩn quốc tế, phòng Mỹ thuật với giá vẽ và ánh sáng tự nhiên, phòng Âm nhạc cách âm trang bị piano và nhạc cụ dân tộc.',
    highlights: [
      'Phòng chuyên đề ngoại ngữ trang bị tai nghe chuyên dụng',
      'Studio âm nhạc và phòng tập múa cho các đội văn nghệ',
      'Phòng thực hành mỹ thuật với triển lãm tranh học sinh',
      'Kho thiết bị thể dục và giáo dục quốc phòng'
    ],
    specs: {
      area: '1.200 m²',
      capacity: '600 học sinh cùng lúc',
      floor: '3 tầng',
      equipment: 'Hệ thống âm thanh Hi-Fi, đàn Piano cơ, tai nghe ngoại ngữ Sennheiser'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Phòng học ngoại ngữ và nghệ thuật sáng tạo tại dãy nhà C'
  },
  {
    id: 'flagpole',
    name: 'Central Courtyard & Flagpole',
    vietnameseName: 'Sân Trường & Cột Cờ Trung Tâm',
    category: 'academic',
    position: [0, 0, 12],
    rotation: 0,
    size: [32, 1, 32],
    icon: 'Flag',
    shortDescription: 'Trái tim của trường - nơi diễn ra lễ chào cờ đầu tuần trang nghiêm và các lễ hội rực rỡ.',
    fullDescription: 'Sân trường lát gạch chống trượt sạch sẽ, rợp bóng mát của những cây bàng cổ thụ và hàng phượng vĩ nở hoa đỏ thắm mỗi độ hè về. Cột cờ inox cao 18m với Quốc kỳ tung bay kiêu hãnh là biểu tượng thiêng liêng trong mỗi buổi sáng thứ Hai chào cờ, cùng sân khấu danh dự tổ chức các lễ kỷ niệm Ngày Nhà giáo Việt Nam 20/11, Ngày thành lập Đoàn 26/3 và Tri ân Trưởng thành.',
    highlights: [
      'Cột cờ inox cao 18m với hệ thống kéo cờ tự động',
      'Bục danh dự trung tâm với hệ thống âm thanh ngoài trời 5000W',
      'Hàng cây phượng vĩ và bàng di sản hơn 40 năm tuổi',
      'Ghế đá rợp bóng mát - nơi lưu giữ ký ức tuổi học trò'
    ],
    specs: {
      area: '2.200 m²',
      capacity: 'Toàn bộ 2.500 cán bộ, giáo viên và học sinh',
      floor: 'Khuôn viên ngoài trời',
      equipment: 'Hệ thống âm thanh sân khấu ngoài trời, mái che di động sự kiện'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Lễ chào cờ trang nghiêm và sân trường rợp bóng phượng đỏ'
  },
  {
    id: 'library',
    name: 'Han Thuyen Library',
    vietnameseName: 'Thư Viện Hàn Thuyên & Thư Viện Xanh',
    category: 'facility',
    position: [-22, 0, -18],
    rotation: 0,
    size: [16, 8, 14],
    icon: 'Library',
    shortDescription: 'Kho tri thức phong phú với hơn 20.000 đầu sách, máy tra cứu điện tử và khu đọc sách xanh.',
    fullDescription: 'Thư viện THPT Hàn Thuyên là điểm đến yêu thích của thầy cô và các bạn đam mê tri thức. Thư viện chia thành 4 khu vực: Kho sách giáo khoa & tham khảo, Khu đọc sách báo và tạp chí khoa học, Thư viện số với 30 máy tính tra cứu tài liệu học thuật trực tuyến, và Không gian đọc mở ngoài trời ngập tràn cây xanh.',
    highlights: [
      'Hơn 20.000 đầu sách tham khảo, văn học kinh điển và tạp chí khoa học',
      'Khu vực máy tra cứu thư viện số và E-book trực tuyến',
      'Góc đọc sách thư giãn với sofa và cây xanh phong cách cà phê sách',
      'Câu lạc bộ đọc sách tổ chức sinh hoạt giao lưu tác giả hàng tháng'
    ],
    specs: {
      area: '380 m²',
      capacity: '150 chỗ ngồi đọc đồng thời',
      floor: 'Tầng 1 dãy C',
      equipment: '30 máy tính kết nối Internet, máy scan/máy in thẻ từ học sinh'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Không gian thư viện ấm cúng với hàng nghìn đầu sách quý và góc đọc sách xanh'
  },
  {
    id: 'computer-lab',
    name: 'Computer & AI Lab',
    vietnameseName: 'Phòng Máy Vi Tính & Không Gian Số',
    category: 'facility',
    position: [-22, 0, -32],
    rotation: 0,
    size: [14, 8, 12],
    icon: 'Monitor',
    shortDescription: '2 phòng thực hành tin học hiện đại với 90 máy tính cấu hình cao kết nối cáp quang.',
    fullDescription: 'Phòng máy vi tính phục vụ bộ môn Tin học phổ thông, bồi dưỡng học sinh giỏi Tin học và các lớp chuyên đề lập trình Python, Web, Trí tuệ Nhân tạo (AI). Phòng học trang bị đường truyền cáp quang băng thông rộng 1Gbps, máy lạnh công suất lớn, hệ thống quản trị lớp học tương tác NetSupport và màn hình chiếu lớn.',
    highlights: [
      '90 dàn máy tính Intel Core i5 thế hệ mới, RAM 16GB, màn hình IPS 24 inch',
      'Đường truyền Internet cáp quang tốc độ cao chuyên dụng',
      'Cài đặt sẵn phần mềm lập trình Python, C++, Scratch, Photoshop, Office 365',
      'Nơi diễn ra các kỳ thi nghề phổ thông và Hội thi Tin học trẻ cấp Quận/Thành phố'
    ],
    specs: {
      area: '220 m²',
      capacity: '90 học sinh/ca thực hành',
      floor: 'Tầng 2 dãy C',
      equipment: '90 PC, 2 Server quản lý, máy chiếu laser, camera giám sát thi'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Phòng thực hành máy tính với dàn PC hiện đại và đường truyền tốc độ cao'
  },
  {
    id: 'science-lab',
    name: 'Science & STEM Labs',
    vietnameseName: 'Phòng Thí Nghiệm Lý - Hóa - Sinh & STEM',
    category: 'facility',
    position: [22, 0, -18],
    rotation: 0,
    size: [16, 8, 14],
    icon: 'FlaskConical',
    shortDescription: 'Khu liên hợp phòng thí nghiệm thực hành chuẩn quốc gia với đầy đủ dụng cụ hóa chất an toàn.',
    fullDescription: 'Bao gồm 3 phòng thí nghiệm độc lập cho 3 bộ môn Vật lý, Hóa học, Sinh học cùng Không gian sáng tạo STEM. Mỗi phòng đều có bàn thực hành chuyên dụng chống ăn mòn, tủ hút khí độc an toàn, kính hiển vi điện tử quang học, cảm biến đo đạc kỹ thuật số Vernier và khu rửa mắt cấp cứu chuẩn quốc tế.',
    highlights: [
      'Trang thiết bị thí nghiệm hiện đại, đảm bảo quy chuẩn an toàn hóa chất',
      'Kính hiển vi quang học độ phóng đại 1600x kết nối màn hình hiển thị',
      'Bộ thí nghiệm cảm biến kỹ thuật số phục vụ đề tài nghiên cứu khoa học',
      'Không gian chế tạo robot và mô hình STEM của học sinh'
    ],
    specs: {
      area: '360 m² (3 phòng x 120 m²)',
      capacity: '45 học sinh/phòng thí nghiệm',
      floor: 'Tầng 1 dãy B',
      equipment: 'Tủ hút độc, vòi sen khẩn cấp, cảm biến số hóa, bộ kit Lego Robotics'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Học sinh thao tác kính hiển vi và dụng cụ thí nghiệm hóa học an toàn'
  },
  {
    id: 'gymnasium',
    name: 'Multipurpose Gymnasium',
    vietnameseName: 'Nhà Thi Đấu Đa Năng',
    category: 'sports',
    position: [34, 0, -32],
    rotation: 0,
    size: [18, 9, 22],
    icon: 'Dumbbell',
    shortDescription: 'Nhà thi đấu có mái che với sàn gỗ đạt chuẩn thể thao, phục vụ bóng chuyền, bóng rổ, cầu lông.',
    fullDescription: 'Nhà thi đấu đa năng THPT Hàn Thuyên là niềm tự hào về cơ sở vật chất thể thao của trường. Mặt sàn trải thảm cao su/sàn gỗ giảm chấn chuyên dụng cho VĐV, hệ thống đèn LED chống chói 500 Lux, khán đài 300 chỗ ngồi và phòng thay đồ/vệ sinh sạch sẽ. Nơi đây là đấu trường sôi động của Hội khỏe Phù Đổng cấp trường hàng năm.',
    highlights: [
      '2 sân cầu lông và 1 sân bóng rổ/bóng chuyền trong nhà đạt chuẩn thi đấu',
      'Khán đài di động 300 chỗ ngồi cổ vũ nhiệt tình',
      'Hệ thống quạt thông gió công nghiệp tạo luồng gió mát mẻ',
      'Phòng chức năng tập bóng bàn, cờ vua và võ thuật'
    ],
    specs: {
      area: '620 m²',
      capacity: '500 vận động viên và khán giả',
      floor: 'Nhà vòm thể thao độc lập',
      equipment: 'Bảng điểm điện tử LED, cột lưới di động, thảm chuyên dụng'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Sàn đấu thể thao trong nhà rực rỡ ánh sáng trong giải đấu học sinh'
  },
  {
    id: 'football-field',
    name: 'Football Field',
    vietnameseName: 'Sân Bóng Đá Mini Cỏ Nhân Tạo',
    category: 'sports',
    position: [16, 0, -56],
    rotation: 0,
    size: [28, 1, 18],
    icon: 'Trophy',
    shortDescription: 'Sân bóng đá cỏ nhân tạo 5 người tiêu chuẩn với hệ thống chiếu sáng ban đêm hiện đại.',
    fullDescription: 'Sân bóng đá mini cỏ nhân tạo xanh mướt là nơi diễn ra giải bóng đá truyền thống "Hàn Thuyên Champion League" mỗi học kỳ. Lớp cỏ nhân tạo chất lượng cao, có hạt cao su đàn hồi giảm chấn thương, lưới bao quanh an toàn và dàn đèn LED cao áp chiếu sáng phục vụ các buổi tập luyện chiều tối của CLB bóng đá trường.',
    highlights: [
      'Mặt sân cỏ nhân tạo thế hệ mới êm ái, bám giày tốt',
      'Khung thành tiêu chuẩn thi đấu 5 người với lưới bảo vệ kiên cố',
      'Dàn đèn pha LED 800W chiếu sáng ban đêm cực tốt',
      'Nơi tổ chức các trận cầu nảy lửa giữa các khối lớp'
    ],
    specs: {
      area: '800 m² (40m x 20m)',
      capacity: '2 đội bóng thi đấu và 200 khán giả quanh sân',
      floor: 'Khu liên hợp thể thao phía sau',
      equipment: 'Khung thành di động, bóng thi đấu FIFA Quality, ghế chờ huấn luyện viên'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Trận bóng đá giao hữu sôi nổi trên sân cỏ nhân tạo rợp nắng'
  },
  {
    id: 'volleyball-court',
    name: 'Volleyball & Basketball Outdoor Court',
    vietnameseName: 'Sân Bóng Chuyền & Bóng Rổ Ngoài Trời',
    category: 'sports',
    position: [-16, 0, -56],
    rotation: 0,
    size: [24, 1, 16],
    icon: 'Activity',
    shortDescription: 'Cụm sân bóng rổ và bóng chuyền ngoài trời sơn acrylic chống trơn trượt.',
    fullDescription: 'Nằm cạnh khu nhà đa năng, cụm sân bóng rổ - bóng chuyền ngoài trời luôn tấp nập tiếng đập bóng và reo hò trong mỗi giờ thể dục hay giờ ra chơi. Trụ bóng rổ nhập khẩu có đệm bảo vệ an toàn, bảng rổ kính cường lực và vạch kẻ sơn phản quang tiêu chuẩn FIBA.',
    highlights: [
      '2 cột rổ thi đấu chuẩn chiều cao 3.05m và bảng kính cường lực',
      '1 sân bóng chuyền có trụ tăng đơ căng lưới chuẩn quốc gia',
      'Sơn sàn Silicon PU 5 lớp chống trơn trượt tuyệt đối trong mọi thời tiết',
      'Hàng cây râm mát bao quanh tạo không khí trong lành'
    ],
    specs: {
      area: '650 m²',
      capacity: '80 học sinh sinh hoạt thể thao cùng lúc',
      floor: 'Khu thể thao ngoài trời',
      equipment: 'Trụ bóng rổ kính cường lực, cột lưới bóng chuyền có đệm chống va đập'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Các bạn học sinh thi đấu bóng rổ sôi động dưới ánh nắng vàng'
  },
  {
    id: 'canteen',
    name: 'School Canteen',
    vietnameseName: 'Nhà Ăn & Căn Tin Học Sinh',
    category: 'services',
    position: [-36, 0, -2],
    rotation: Math.PI / 2,
    size: [10, 5, 20],
    icon: 'Coffee',
    shortDescription: 'Khu ẩm thực học đường sạch sẽ, văn minh, đạt chứng nhận Vệ sinh An toàn Thực phẩm.',
    fullDescription: 'Căn tin THPT Hàn Thuyên là thiên đường ăn vặt và nạp năng lượng sau những tiết học căng thẳng. Được thiết kế theo mô hình quán cà phê học đường hiện đại với bàn ghế gỗ sạch đẹp, thực đơn phong phú từ bữa ăn trưa bán trú dinh dưỡng (cơm sườn, bún bò, nui xào) đến các món ăn vặt quen thuộc của học trò như bánh tráng trộn, trà sữa, kem tươi, trà đào hạt chia.',
    highlights: [
      'Đạt chứng nhận Vệ sinh An toàn Thực phẩm cấp bởi Sở Y tế TP.HCM',
      'Thực đơn thay đổi theo ngày, kiểm nghiệm lưu mẫu thực phẩm 24h',
      'Hỗ trợ thanh toán tiện lợi bằng thẻ học sinh thông minh hoặc mã QR',
      'Không gian máy lạnh và khu vực ngồi thoáng mát ngoài sân vườn'
    ],
    specs: {
      area: '280 m²',
      capacity: '200 chỗ ngồi dùng bữa đồng thời',
      floor: 'Tầng trệt cạnh dãy A',
      equipment: 'Tủ giữ nhiệt thức ăn, quầy nước tự chọn, máy khử khuẩn bát đĩa UV'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Khu vực căn tin ấm cúng với những món ăn thơm ngon và nụ cười học sinh'
  },
  {
    id: 'health-clinic',
    name: 'School Medical Clinic',
    vietnameseName: 'Phòng Y Tế Học Đường',
    category: 'services',
    position: [-36, 0, 16],
    rotation: Math.PI / 2,
    size: [8, 5, 12],
    icon: 'HeartPulse',
    shortDescription: 'Nơi chăm sóc sức khỏe, sơ cấp cứu ban đầu với y bác sĩ túc trực toàn thời gian.',
    fullDescription: 'Phòng Y tế được trang bị đầy đủ giường bệnh, tủ thuốc cấp cứu thiết yếu, máy đo huyết áp điện tử, máy đo SpO2 và bình oxy y tế. Đội ngũ cán bộ y tế trường học luôn sẵn sàng hỗ trợ học sinh khi có dấu hiệu mệt mỏi, cảm sốt hoặc chấn thương nhẹ khi vận động thể thao, đồng thời định kỳ tổ chức khám sức khỏe và tiêm chủng.',
    highlights: [
      'Cán bộ y tế có chứng chỉ hành nghề trực 100% thời gian học sinh ở trường',
      '4 giường bệnh nghỉ ngơi sạch sẽ, thoáng khí',
      'Cơ số thuốc cấp cứu thiết yếu và bông băng nẹp chấn thương thể thao',
      'Phát động các chiến dịch nha học đường và phòng chống dịch bệnh mùa hè'
    ],
    specs: {
      area: '70 m²',
      capacity: '4 giường bệnh & 1 phòng khám',
      floor: 'Tầng trệt gần cổng trường',
      equipment: 'Máy đo tim mạch, bình oxy dự phòng, tủ thuốc chuẩn Bộ Y tế'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Phòng y tế khang trang, sạch sẽ với đầy đủ thiết bị chăm sóc học sinh'
  },
  {
    id: 'teachers-room',
    name: 'Teachers & Faculty Lounge',
    vietnameseName: 'Phòng Giáo Viên & Sinh Hoạt Tổ Chuyên Môn',
    category: 'admin',
    position: [36, 0, 16],
    rotation: -Math.PI / 2,
    size: [10, 5, 18],
    icon: 'Users',
    shortDescription: 'Không gian làm việc, nghiên cứu bài giảng và nghỉ ngơi thân tình của tập thể thầy cô giáo.',
    fullDescription: 'Phòng giáo viên là nơi các thầy cô hội ý chuyên môn, chấm bài và chuẩn bị các tiết dạy truyền cảm hứng. Phòng được bố trí bàn làm việc theo từng Tổ chuyên môn (Toán, Văn, Ngoại ngữ, KHTN, KHXH), góc uống trà cà phê thư giãn, tủ tài liệu chuyên môn và thư viện giáo án số.',
    highlights: [
      'Khu vực làm việc phân khu theo 9 tổ chuyên môn sư phạm',
      'Máy in, máy scan và máy photocopy phục vụ in ấn đề kiểm tra',
      'Không gian sinh hoạt công đoàn ấm cúng, gắn kết tình đồng nghiệp',
      'Bảng phân công nhiệm vụ và lịch hội giảng hàng tuần'
    ],
    specs: {
      area: '160 m²',
      capacity: '80 giáo viên làm việc',
      floor: 'Tầng 1 dãy Hiệu bộ',
      equipment: 'Máy tính chuyên dụng, máy in tốc độ cao, tủ hồ sơ cá nhân'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Phòng làm việc giáo viên ấm cúng và đầy ắp sách tài liệu sư phạm'
  },
  {
    id: 'administration',
    name: 'Administration & Principal Board',
    vietnameseName: 'Phòng Hiệu Bộ & Ban Giám Hiệu',
    category: 'admin',
    position: [36, 0, -2],
    rotation: -Math.PI / 2,
    size: [10, 6, 16],
    icon: 'Landmark',
    shortDescription: 'Trung tâm chỉ đạo điều hành của Ban Giám hiệu, Văn phòng Đảng ủy, Đoàn trường và Học vụ.',
    fullDescription: 'Tòa nhà Hiệu bộ nằm trang trọng phía trước sân trường, bao gồm Văn phòng Hiệu trưởng, các Phó Hiệu trưởng, Phòng Học vụ - Khảo thí, Văn phòng Đoàn Thanh niên và Phòng Tiếp phụ huynh. Nơi đây điều hành toàn diện công tác giáo dục, đối ngoại và tiếp nhận giải quyết các thủ tục học vụ của phụ huynh học sinh.',
    highlights: [
      'Phòng tiếp công dân và phụ huynh lịch sự, tận tình',
      'Phòng truyền thống lưu giữ cờ thi đua và huân chương khen tặng của trường',
      'Văn phòng Đoàn trường năng động, đầu mối mọi phong trào tình nguyện',
      'Phòng họp hội đồng sư phạm trang bị hệ thống họp trực tuyến'
    ],
    specs: {
      area: '260 m²',
      capacity: 'Bộ máy quản lý 25 cán bộ quản lý và nhân viên văn phòng',
      floor: 'Tầng 1 & Tầng 2',
      equipment: 'Hệ thống truyền hình hội nghị trực tuyến, camera an ninh toàn trường'
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    mediaPlaceholderText: 'Văn phòng Ban Giám hiệu trang trọng và Phòng truyền thống lưu giữ kỷ vật'
  }
];

export const SCHOOL_CLUBS: ClubActivity[] = [
  {
    id: 'htmc',
    name: 'CLB Truyền Thông & Nhiếp Ảnh Hàn Thuyên',
    acronym: 'HTMC (Han Thuyen Media Club)',
    badgeColor: '#3B82F6',
    category: 'media',
    purpose: 'Ghi lại những khoảnh khắc thanh xuân rực rỡ dưới mái trường Hàn Thuyên, đào tạo kỹ năng nhiếp ảnh, quay phim, viết bài và thiết kế đồ họa.',
    mainActivities: [
      'Tác nghiệp hình ảnh và phát sóng trực tiếp (livestream) tất cả các sự kiện lớn của trường',
      'Sản xuất các tập kỷ yếu, video kỷ niệm học sinh cuối cấp và radio podcast học đường',
      'Workshop đào tạo kỹ năng chụp ảnh bằng máy cơ (DSLR/Mirrorless) và chỉnh sửa ảnh Lightroom/Photoshop',
      'Tổ chức cuộc thi nhiếp ảnh thường niên "Nắng Hàn Thuyên Trong Mắt Tôi"'
    ],
    schedule: 'Chiều thứ Năm hàng tuần (16h45 - 18h15)',
    location: 'Phòng Tin Học 1 (Tầng 2 dãy C) & Studio Dãy Hiệu Bộ',
    memberCount: '35 thành viên nòng cốt',
    contact: {
      leader: 'Bạn Nguyễn Lê Minh Thư (Lớp 11A1 - Chủ nhiệm CLB)',
      email: 'htmc.hanthuyen@gmail.com',
      fanpage: 'facebook.com/HanThuyenMediaClub',
      phone: '0903.123.456'
    },
    achievements: [
      'Giải Nhất cuộc thi Clip ngắn "Nét đẹp học sinh TP.HCM" năm 2024',
      'Đơn vị bảo trợ truyền thông chính thức cho Hội trại truyền thống 26/3'
    ]
  },
  {
    id: 'htac',
    name: 'CLB Âm Nhạc & Nghệ Thuật Hàn Thuyên',
    acronym: 'HTAC (Han Thuyen Music & Arts Club)',
    badgeColor: '#EC4899',
    category: 'arts',
    purpose: 'Ươm mầm tài năng âm nhạc, thanh nhạc và nhạc cụ, tạo sân chơi biểu diễn nghệ thuật thăng hoa cho học sinh sau giờ học.',
    mainActivities: [
      'Luyện tập thanh nhạc, guitar, piano, cajon và hòa tấu nhạc cụ dân tộc',
      'Biểu diễn văn nghệ chào mừng tại Lễ Khai giảng, 20/11 và các chương trình gây quỹ từ thiện',
      'Tổ chức đêm nhạc acoustic "Giai Điệu Hàn Thuyên" dưới tán cây sân trường',
      'Giao lưu âm nhạc với các trường THPT bạn trong cụm Phú Nhuận - Quận 3'
    ],
    schedule: 'Chiều thứ Bảy hàng tuần (14h00 - 17h00)',
    location: 'Phòng Âm Nhạc (Tầng 1 dãy C) & Sân cờ trung tâm',
    memberCount: '45 thành viên',
    contact: {
      leader: 'Bạn Trần Hoàng Quân (Lớp 12D2 - Trưởng ban Acoustic)',
      email: 'htmusic.club@hanthuyen.edu.vn',
      fanpage: 'facebook.com/HanThuyenAcousticClub'
    },
    achievements: [
      'Giải Nhì Hội thi Giai điệu Tuổi hồng cấp Thành phố',
      'Hơn 10 video ca nhạc học đường đạt hàng chục nghìn lượt xem trên mạng xã hội'
    ]
  },
  {
    id: 'htdc',
    name: 'CLB Vũ Đạo Hiện Đại Hàn Thuyên',
    acronym: 'H.T Dance Crew',
    badgeColor: '#8B5CF6',
    category: 'arts',
    purpose: 'Đốt cháy đam mê vũ đạo với các thể loại Kpop Cover, Hip-hop, Choreography và Popping, rèn luyện sự dẻo dai và tự tin trên sân khấu.',
    mainActivities: [
      'Tập luyện đội hình vũ đạo định kỳ, nâng cao thể lực và cảm thụ tiết tấu',
      'Biểu diễn bùng nổ trong các sự kiện dạ hội, flashmob khai mạc lễ hội trường',
      'Tham gia các giải đấu nhảy học sinh sinh viên quy mô toàn TP. Hồ Chí Minh',
      'Quay video dance cover tại các góc check-in tuyệt đẹp của trường'
    ],
    schedule: 'Chiều thứ Tư và Chủ Nhật (16h30 - 18h30)',
    location: 'Sảnh trước Nhà thi đấu đa năng hoặc Sân trường',
    memberCount: '30 vũ công trẻ tài năng',
    contact: {
      leader: 'Bạn Phạm Thùy Linh (Lớp 11B3 - Captain H.T Dance Crew)',
      email: 'htdancecrew@gmail.com',
      fanpage: 'facebook.com/HTDanceCrewOfficial'
    },
    achievements: [
      'Top 3 Hội thi Flashmob Học đường TP.HCM 2024',
      'Quán quân Cuộc thi Nhảy Vũ điệu Học trò Cụm 2'
    ]
  },
  {
    id: 'htec',
    name: 'CLB Tiếng Anh Hàn Thuyên',
    acronym: 'HTEC (Han Thuyen English Club)',
    badgeColor: '#10B981',
    category: 'academic',
    purpose: 'Tạo môi trường giao tiếp 100% tiếng Anh tự nhiên, nâng cao kỹ năng IELTS, tranh biện (Debate) và tìm hiểu văn hóa quốc tế.',
    mainActivities: [
      'Buổi thảo luận chủ đề (Speaking Table) bằng tiếng Anh hàng tuần về các vấn đề xã hội thú vị',
      'CLB Tranh biện tiếng Anh theo luật nghị viện Anh (British Parliamentary)',
      'Giao lưu với các tình nguyện viên quốc tế và cựu du học sinh',
      'Tổ chức ngày hội "English Festival Day" với gian hàng ẩm thực và trò chơi ngôn ngữ'
    ],
    schedule: 'Sáng Chủ Nhật (8h30 - 11h00)',
    location: 'Thư viện Hàn Thuyên & Phòng Ngoại ngữ dãy C',
    memberCount: '60 thành viên',
    contact: {
      leader: 'Bạn Đỗ Vũ Bảo Châu (Lớp 11 Chuyên Anh - Chủ tịch HTEC)',
      email: 'htec.speaking@gmail.com',
      fanpage: 'facebook.com/HanThuyenEnglishClub'
    },
    achievements: [
      'Học sinh CLB đạt giải Ba Cuộc thi Hùng biện Tiếng Anh cấp Quốc gia',
      '85% thành viên lớp 12 trong ban điều hành đạt IELTS 7.5+ trở lên'
    ]
  },
  {
    id: 'htsc',
    name: 'CLB Bóng Rổ & Thể Thao Hàn Thuyên',
    acronym: 'HTSC (Han Thuyen Sports & Basketball Club)',
    badgeColor: '#F97316',
    category: 'sports',
    purpose: 'Xây dựng tinh thần đồng đội thể thao cao thượng, rèn luyện thể lực và chinh phục các giải bóng rổ học sinh TP. Hồ Chí Minh.',
    mainActivities: [
      'Tập luyện kỹ thuật rê bóng, ném rổ 3 điểm, phòng thủ và chiến thuật phối hợp',
      'Đấu giao hữu hàng tháng với các đội bóng rổ THPT Phú Nhuận, Gia Định, Nguyễn Thị Minh Khai',
      'Tổ chức Giải đấu nội bộ 3x3 và 5x5 giữa các khối lớp',
      'Hỗ trợ tập luyện cho các bạn học sinh mới bắt đầu tiếp cận môn bóng rổ'
    ],
    schedule: 'Chiều thứ Ba, Năm, Bảy (16h30 - 18h30)',
    location: 'Sân bóng rổ ngoài trời & Nhà thi đấu đa năng',
    memberCount: '40 vận động viên',
    contact: {
      leader: 'Bạn Lâm Gia Huy (Lớp 12A3 - Đội trưởng tuyển Bóng rổ)',
      email: 'htsc.sports@hanthuyen.edu.vn',
      fanpage: 'facebook.com/HanThuyenBasketballClub',
      phone: '0918.889.991'
    },
    achievements: [
      'Huy chương Đồng Giải Bóng Rổ Học Sinh TP.HCM - Cúp Milo',
      'Vô địch Giải Bóng Rổ Thể Thao Học Đường Quận Phú Nhuận 2 năm liên tiếp'
    ]
  },
  {
    id: 'ht-stem',
    name: 'CLB Sáng Tạo STEM & Robotics',
    acronym: 'HT STEM Innovation Club',
    badgeColor: '#06B6D4',
    category: 'academic',
    purpose: 'Nghiên cứu khoa học kỹ thuật, chế tạo robot, ứng dụng Internet of Things (IoT) và lập trình điều khiển vào đời sống học đường.',
    mainActivities: [
      'Chế tạo xe tự hành, cánh tay robot và mô hình nhà thông minh bằng Arduino / ESP32',
      'Thực hiện các đề tài dự thi Khoa học Kỹ thuật (KHKT) dành cho học sinh trung học',
      'Workshop in 3D, thiết kế mạch điện tử và lập trình mô phỏng vi điều khiển',
      'Tổ chức Ngày hội Khoa học Sáng tạo STEM Day cho toàn trường'
    ],
    schedule: 'Sáng thứ Bảy (8h00 - 11h30)',
    location: 'Không Gian Sáng Tạo STEM (Phòng Lab 3 dãy B)',
    memberCount: '28 thành viên',
    contact: {
      leader: 'Bạn Vũ Đình Khang (Lớp 11 Tin - Trưởng nhóm Kỹ thuật)',
      email: 'stem.hanthuyen@gmail.com',
      fanpage: 'facebook.com/HanThuyenSTEMClub'
    },
    achievements: [
      'Giải Nhì Cuộc thi Khoa học Kỹ thuật cấp Thành phố năm học 2024-2025',
      'Dự án "Thùng rác thông minh phân loại tự động bằng AI" được triển khai thực tế tại trường'
    ]
  },
  {
    id: 'ht-volunteer',
    name: 'CLB Kỹ Năng Sống & Tình Nguyện Hoa Phượng Đỏ',
    acronym: 'HT Volunteer Club',
    badgeColor: '#EF4444',
    category: 'social',
    purpose: 'Lan tỏa yêu thương và trách nhiệm cộng đồng, rèn luyện kỹ năng sinh tồn, dã ngoại, sơ cấp cứu và các hoạt động công tác xã hội ý nghĩa.',
    mainActivities: [
      'Tổ chức chiến dịch tình nguyện hè "Hoa Phượng Đỏ" giúp đỡ các mái ấm, người già neo đơn',
      'Chương trình "Trung Thu Cho Em" và "Xuân Tình Nguyện" tặng quà học sinh khó khăn vùng xa',
      'Tập huấn kỹ năng dã ngoại, thắt nút dây, morse, semaphore và kỹ năng thoát hiểm khi hỏa hoạn',
      'Phong trào "Trường học Xanh" thu gom pin cũ, phân loại rác tái chế và chăm sóc cây xanh'
    ],
    schedule: 'Chiều Chủ Nhật hàng tuần (14h30 - 17h00)',
    location: 'Sân cờ trung tâm & Văn phòng Đoàn trường',
    memberCount: '70 tình nguyện viên nhiệt huyết',
    contact: {
      leader: 'Bạn Hoàng Mai Phương (Lớp 11D1 - Bí thư Chi đoàn khối)',
      email: 'hoaphuongdo.hanthuyen@gmail.com',
      fanpage: 'facebook.com/HoaPhuongDoHanThuyen'
    },
    achievements: [
      'Bằng khen của Thành Đoàn TP. Hồ Chí Minh vì thành tích xuất sắc trong Chiến dịch Hoa Phượng Đỏ',
      'Quyên góp hơn 50 triệu đồng và 1.200 đầu sách cho các điểm trường vùng bão lũ'
    ]
  },
  {
    id: 'ht-literature',
    name: 'CLB Văn Học & Báo Chí "Bút Hoa Hàn Thuyên"',
    acronym: 'Bút Hoa Hàn Thuyên',
    badgeColor: '#CA8A04',
    category: 'academic',
    purpose: 'Nuôi dưỡng tâm hồn văn chương, tự hào về chữ Nôm và danh sĩ Hàn Thuyên, rèn luyện kỹ năng viết phóng sự báo chí và sáng tác thi ca.',
    mainActivities: [
      'Biên tập và xuất bản Bản tin nội bộ "Giai Phẩm Hàn Thuyên" vào các dịp lễ lớn',
      'Tọa đàm chuyên đề văn học về danh nhân Hàn Thuyên và văn học trung đại Việt Nam',
      'CLB viết tản văn, truyện ngắn và thơ tuổi học trò',
      'Giao lưu với các nhà văn, nhà thơ và phóng viên báo Hoa Học Trò, Mực Tím'
    ],
    schedule: 'Chiều thứ Sáu (16h45 - 18h15)',
    location: 'Thư viện trường (Khu đọc sách mở ngoài trời)',
    memberCount: '25 cây bút học trò',
    contact: {
      leader: 'Bạn Lê Quỳnh Anh (Lớp 12 Văn - Chủ nhiệm Bút nhóm)',
      email: 'buthoahanthuyen@gmail.com',
      fanpage: 'facebook.com/ButHoaHanThuyen'
    },
    achievements: [
      'Nhiều thành viên đạt giải Học sinh Giỏi Văn cấp Thành phố và giải thưởng Báo Mực Tím',
      'Xuất bản tuyển tập thơ văn học sinh "Dưới Bóng Bàng Hàn Thuyên"'
    ]
  }
];

export const ADMISSION_DATA: AdmissionInfo = {
  schoolYear: 'Năm học 2025 - 2026 / 2026 - 2027',
  totalQuota: 675,
  classesCount: 15,
  address: 'Khu vực Phú Nhuận, Thành phố Hồ Chí Minh',
  hotline: '(028) 3844.xxxx - Bộ phận Tuyển sinh THPT Hàn Thuyên',
  conditions: [
    'Học sinh đã tốt nghiệp Trung học cơ sở (THCS) tại các trường THCS trên địa bàn TP. Hồ Chí Minh trong độ tuổi quy định.',
    'Xếp loại hạnh kiểm và học lực cả năm học các lớp THCS từ Khá trở lên.',
    'Có hồ sơ đăng ký nguyện vọng lớp 10 trực tuyến hợp lệ trên hệ thống của Sở Giáo dục và Đào tạo TP.HCM.',
    'Có tham dự đầy đủ 3 bài thi tuyển sinh vào lớp 10 công lập (Toán, Ngữ văn, Ngoại ngữ) và không có bài thi nào bị điểm 0.'
  ],
  methods: [
    {
      name: 'Thi Tuyển Chung 3 Môn (Kỳ thi vào lớp 10 của Sở GD&ĐT TP.HCM)',
      description: 'Phương thức chính yếu chiếm 100% chỉ tiêu vào các lớp 10 thường và lớp ngoại ngữ tiếng Anh tăng cường.',
      subjects: [
        'Môn Toán (Hệ số 1, thời gian làm bài 120 phút)',
        'Môn Ngữ Văn (Hệ số 1, thời gian làm bài 120 phút)',
        'Môn Ngoại ngữ (Tiếng Anh) (Hệ số 1, thời gian làm bài 90 phút)'
      ],
      benchmarkHistory: [
        { year: '2022', score: 18.25 },
        { year: '2023', score: 19.50 },
        { year: '2024', score: 20.00 },
        { year: '2025 (Dự kiến)', score: 20.50 }
      ]
    }
  ],
  timeline: [
    {
      stage: 'Bước 1: Tìm hiểu & Tư vấn nguyện vọng trực tuyến',
      time: 'Tháng 4 hàng năm',
      description: 'Nhà trường mở cổng tư vấn tuyển sinh trực tuyến và tổ chức "Ngày hội Open Day - Một ngày làm học sinh Hàn Thuyên" đón phụ huynh và học sinh lớp 9.',
      status: 'completed'
    },
    {
      stage: 'Bước 2: Đăng ký 3 nguyện vọng vào lớp 10',
      time: 'Đầu tháng 5 hàng năm',
      description: 'Học sinh đăng ký trên cổng thông tin tuyển sinh của Sở GD&ĐT TP.HCM qua tài khoản trường THCS cấp.',
      status: 'completed'
    },
    {
      stage: 'Bước 3: Kỳ thi Tuyển sinh Lớp 10 Công lập',
      time: 'Đầu tháng 6 hàng năm (Dự kiến ngày 06 - 07/06)',
      description: 'Thí sinh tham dự 3 môn thi: Ngữ văn, Ngoại ngữ (ngày 1) và Toán (ngày 2) tại điểm thi được phân công.',
      status: 'active'
    },
    {
      stage: 'Bước 4: Công bố kết quả thi và Điểm chuẩn trúng tuyển',
      time: 'Cuối tháng 6 - Đầu tháng 7 hàng năm',
      description: 'Sở GD&ĐT TP.HCM công bố điểm thi và điểm chuẩn xét tuyển chính thức vào Trường THPT Hàn Thuyên.',
      status: 'upcoming'
    },
    {
      stage: 'Bước 5: Nộp hồ sơ nhập học chính thức',
      time: 'Giữa tháng 7 hàng năm',
      description: 'Học sinh trúng tuyển chuẩn bị hồ sơ gốc (học bạ THCS, giấy chứng nhận tốt nghiệp tạm thời, bản sao khai sinh) đến trường làm thủ tục nhập học và chọn tổ hợp môn lựa chọn.',
      status: 'upcoming'
    }
  ],
  scholarships: [
    {
      id: 'sch-valedictorian',
      name: 'Học Bổng Thủ Khoa & Á Khoa Đầu Vào Hàn Thuyên',
      value: '10.000.000 VNĐ / suất + Toàn bộ đồng phục và sách giáo khoa',
      donor: 'Hội đồng Sư phạm & Hội Cha mẹ Học sinh Trường THPT Hàn Thuyên',
      quota: '03 suất (01 Thủ khoa, 02 Á khoa tuyển sinh)',
      eligibility: [
        'Đạt điểm thi tuyển sinh vào lớp 10 cao nhất toàn trường',
        'Điểm trung bình các môn thi từ 9.0 trở lên',
        'Duy trì kết quả học tập xếp loại Xuất sắc trong năm học lớp 10'
      ],
      description: 'Tôn vinh nỗ lực xuất sắc của các tân thủ khoa lớp 10, khích lệ tinh thần phấn đấu vươn lên đỉnh cao học thuật dưới mái trường Hàn Thuyên.'
    },
    {
      id: 'sch-alumni',
      name: 'Quỹ Học Bổng "Tiếp Bước Đàn Em" - Cựu Học Sinh Hàn Thuyên',
      value: '5.000.000 VNĐ / suất / kỳ + Học bổng tiếng Anh/Tin học',
      donor: 'Ban Liên Lạc Cựu Học Sinh THPT Hàn Thuyên các thời kỳ',
      quota: '20 suất mỗi năm học',
      eligibility: [
        'Học sinh có hoàn cảnh gia đình khó khăn, mồ côi hoặc gia đình chính sách',
        'Có tinh thần vượt khó, học lực đạt từ loại Khá trở lên',
        'Có đạo đức tốt, tích cực tham gia hoạt động phong trào Đoàn trường'
      ],
      description: 'Nghĩa tình sâu nặng của các thế hệ cựu học sinh Hàn Thuyên tiếp sức cho các em khóa sau an tâm cắp sách tới trường, không để học sinh nào vì khó khăn mà phải bỏ dở ước mơ.'
    },
    {
      id: 'sch-talent',
      name: 'Học Bổng "Tài Năng Trẻ Hàn Thuyên"',
      value: '3.000.000 - 8.000.000 VNĐ / suất',
      donor: 'Quỹ Khuyến học & Các Doanh nghiệp tài trợ',
      quota: '15 suất mỗi năm học',
      eligibility: [
        'Học sinh đạt giải Nhất, Nhì, Ba trong kỳ thi Học sinh Giỏi cấp Thành phố hoặc Quốc gia',
        'Đạt huy chương vàng/bạc tại các giải Thể thao, Khoa học Kỹ thuật (KHKT), Sáng tạo Trẻ',
        'Có công trình nghiên cứu hoặc sản phẩm khởi nghiệp đổi mới sáng tạo tiêu biểu'
      ],
      description: 'Khen thưởng xứng đáng cho các học sinh mang lại niềm vinh dự, giải thưởng cao quý về cho bảng vàng truyền thống trường THPT Hàn Thuyên.'
    },
    {
      id: 'sch-green',
      name: 'Học Bổng Đồng Hành Vượt Khó Vươn Lên',
      value: 'Hỗ trợ 100% học phí và bảo hiểm y tế suốt 3 năm THPT',
      donor: 'Quỹ Vì Người Nghèo & Nhà Hảo Tâm Quận Phú Nhuận',
      quota: '10 suất',
      eligibility: [
        'Học sinh thuộc hộ nghèo, cận nghèo trên địa bàn TP.HCM',
        'Có hạnh kiểm Tốt, chuyên cần trong học tập',
        'Được giáo viên chủ nhiệm và chính quyền địa phương xác nhận'
      ],
      description: 'Đảm bảo trọn vẹn quyền được học tập cho học sinh nghèo hiếu học, mang lại tương lai tươi sáng và cơ hội bước vào giảng đường đại học.'
    }
  ]
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q-gate',
    title: 'Check-in Bia Tưởng Niệm Danh Sĩ Hàn Thuyên',
    locationId: 'gate',
    description: 'Đến cổng trường và đọc văn bia tưởng niệm danh nhân Hàn Thuyên - ông tổ chữ Nôm thời nhà Trần.',
    rewardPoints: 100,
    completed: false,
    hint: 'Cổng chính rợp bóng cây ngay lối vào trường'
  },
  {
    id: 'q-flagpole',
    title: 'Nghi Thức Chào Cờ Tại Sân Trường Xanh',
    locationId: 'flagpole',
    description: 'Tiến vào trung tâm sân trường, đứng dưới chân cột cờ 18m ngắm cờ đỏ sao vàng tung bay.',
    rewardPoints: 150,
    completed: false,
    hint: 'Sân cờ trung tâm ở giữa các dãy nhà A và B'
  },
  {
    id: 'q-library',
    title: 'Khám Phá Thư Viện Xanh Hàn Thuyên',
    locationId: 'library',
    description: 'Ghé thăm Thư viện, tìm cuốn sách về lịch sử hình thành và phát triển của trường THPT Hàn Thuyên.',
    rewardPoints: 150,
    completed: false,
    hint: 'Tầng 1 dãy C, kế bên góc đọc sách xanh ngoài trời'
  },
  {
    id: 'q-sports',
    title: 'Ném Bóng Vào Rổ Tại Khu Thể Thao',
    locationId: 'volleyball-court',
    description: 'Thử sức ném trúng bóng vào rổ tại sân bóng rổ ngoài trời để nhận điểm thưởng thể lực!',
    rewardPoints: 200,
    completed: false,
    hint: 'Khu thể thao phía sau dãy nhà bên trái'
  },
  {
    id: 'q-canteen',
    title: 'Thưởng Thức Ẩm Thực Căn Tin Giờ Ra Chơi',
    locationId: 'canteen',
    description: 'Đến căn tin học sinh, chọn món ăn vặt học trò yêu thích để nạp đầy thanh năng lượng.',
    rewardPoints: 100,
    completed: false,
    hint: 'Nằm bên hông dãy A, thơm lừng mùi bánh mì và trà đào'
  },
  {
    id: 'q-photo',
    title: 'Chụp Ảnh Kỷ Yếu Lưu Giữ Thanh Xuân',
    locationId: 'block-a',
    description: 'Sử dụng chế độ Máy ảnh (Phím C hoặc nút Camera) chụp ít nhất 1 bức ảnh kỷ niệm dưới mái trường.',
    rewardPoints: 200,
    completed: false,
    hint: 'Hành lang rợp hoa phượng vĩ hoặc góc ghế đá sân trường'
  }
];
