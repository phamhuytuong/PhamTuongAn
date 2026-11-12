import * as THREE from 'three';

// Cache generated textures so we never re-allocate
const textureCache: Record<string, THREE.CanvasTexture> = {};

function create2DCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

// 1. School Gate Banner: "TRƯỜNG THPT HÀN THUYÊN"
export function getGateBannerTexture(): THREE.CanvasTexture {
  if (textureCache['gateBanner']) return textureCache['gateBanner'];

  const [canvas, ctx] = create2DCanvas(1024, 256);

  // Background deep red with gold border
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(0, 0, 1024, 256);

  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 14;
  ctx.strokeRect(16, 16, 1024 - 32, 256 - 32);

  ctx.fillStyle = '#FEF08A';
  ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH', 512, 72);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px "Segoe UI", Roboto, sans-serif';
  ctx.fillText('TRƯỜNG THPT HÀN THUYÊN', 512, 160);

  ctx.fillStyle = '#FDE047';
  ctx.font = 'italic 28px "Segoe UI", Roboto, sans-serif';
  ctx.fillText('PHƯỜNG PHÚ NHUẬN · TP. HỒ CHÍ MINH', 512, 214);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['gateBanner'] = tex;
  return tex;
}

// 2. National Flag of Vietnam (Cờ Đỏ Sao Vàng)
export function getVietnamFlagTexture(): THREE.CanvasTexture {
  if (textureCache['vnFlag']) return textureCache['vnFlag'];

  const [canvas, ctx] = create2DCanvas(600, 400);

  // Red background
  ctx.fillStyle = '#DA251D';
  ctx.fillRect(0, 0, 600, 400);

  // Yellow 5-point star in center
  ctx.fillStyle = '#FFFF00';
  const cx = 300;
  const cy = 200;
  const spikes = 5;
  const outerRadius = 120;
  const innerRadius = 48;

  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['vnFlag'] = tex;
  return tex;
}

// 3. School Yellow Stucco Wall with Architectural Mouldings
export function getSchoolWallTexture(): THREE.CanvasTexture {
  if (textureCache['schoolWall']) return textureCache['schoolWall'];

  const [canvas, ctx] = create2DCanvas(512, 512);

  // Classic Vietnamese French-influenced school ochre yellow
  ctx.fillStyle = '#EAB308'; // Ochre yellow
  ctx.fillRect(0, 0, 512, 512);

  // Stucco grain & shading
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.12;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(161,98,7,${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Horizontal plaster relief trims
  ctx.fillStyle = 'rgba(254, 243, 199, 0.5)';
  ctx.fillRect(0, 120, 512, 12);
  ctx.fillRect(0, 250, 512, 12);
  ctx.fillRect(0, 380, 512, 12);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['schoolWall'] = tex;
  return tex;
}

// 4. Terracotta Roof Tiles (Ngói Đỏ)
export function getRoofTileTexture(): THREE.CanvasTexture {
  if (textureCache['roofTile']) return textureCache['roofTile'];

  const [canvas, ctx] = create2DCanvas(512, 512);

  ctx.fillStyle = '#991B1B'; // Deep terracotta red
  ctx.fillRect(0, 0, 512, 512);

  // Tile ridges
  const tileH = 32;
  const tileW = 64;
  for (let y = 0; y < 512; y += tileH) {
    const offsetX = (y / tileH) % 2 === 0 ? 0 : tileW / 2;
    for (let x = -tileW; x < 512 + tileW; x += tileW) {
      ctx.strokeStyle = '#7F1D1D';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x + offsetX, y, tileW, tileH);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(x + offsetX + 2, y + 2, tileW - 4, tileH / 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['roofTile'] = tex;
  return tex;
}

// 5. School Yard Paver Tiles (Gạch Lát Sân Trường)
export function getCourtyardPaverTexture(): THREE.CanvasTexture {
  if (textureCache['paver']) return textureCache['paver'];

  const [canvas, ctx] = create2DCanvas(512, 512);

  ctx.fillStyle = '#CBD5E1'; // Light grey stone paver
  ctx.fillRect(0, 0, 512, 512);

  const size = 64;
  for (let x = 0; x < 512; x += size) {
    for (let y = 0; y < 512; y += size) {
      const isRedBrick = ((x / size) + (y / size)) % 3 === 0;
      ctx.fillStyle = isRedBrick ? '#E2E8F0' : '#F1F5F9';
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, size, size);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 12);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['paver'] = tex;
  return tex;
}

// 6. Basketball / Volleyball Court Marking
export function getBasketballCourtTexture(): THREE.CanvasTexture {
  if (textureCache['bball']) return textureCache['bball'];

  const [canvas, ctx] = create2DCanvas(1024, 680);

  // Silicon PU Navy & Terracotta zones
  ctx.fillStyle = '#0284C7'; // Blue court
  ctx.fillRect(0, 0, 1024, 680);

  // Key areas terracotta
  ctx.fillStyle = '#EA580C';
  ctx.fillRect(40, 200, 220, 280);
  ctx.fillRect(1024 - 260, 200, 220, 280);

  // Court lines
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1024 - 80, 680 - 80);

  // Half-court line & center circle
  ctx.beginPath();
  ctx.moveTo(512, 40);
  ctx.lineTo(512, 640);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 340, 90, 0, Math.PI * 2);
  ctx.stroke();

  // 3-point lines
  ctx.beginPath();
  ctx.arc(40, 340, 260, -Math.PI / 2.3, Math.PI / 2.3);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(1024 - 40, 340, 260, Math.PI - Math.PI / 2.3, Math.PI + Math.PI / 2.3);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['bball'] = tex;
  return tex;
}

// 7. Mini Football Field Turf (Cỏ nhân tạo sọc & vạch sơn)
export function getFootballTurfTexture(): THREE.CanvasTexture {
  if (textureCache['turf']) return textureCache['turf'];

  const [canvas, ctx] = create2DCanvas(1024, 640);

  // Alternating green stripes
  const stripeW = 64;
  for (let x = 0; x < 1024; x += stripeW) {
    ctx.fillStyle = (x / stripeW) % 2 === 0 ? '#15803D' : '#16A34A';
    ctx.fillRect(x, 0, stripeW, 640);
  }

  // Field markings
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, 1024 - 60, 640 - 60);

  // Center line and circle
  ctx.beginPath();
  ctx.moveTo(512, 30);
  ctx.lineTo(512, 610);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 320, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Goal areas
  ctx.strokeRect(30, 220, 120, 200);
  ctx.strokeRect(1024 - 150, 220, 120, 200);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['turf'] = tex;
  return tex;
}

// 8. Classroom Blackboard ("TIÊN HỌC LỄ - HẬU HỌC VĂN")
export function getBlackboardTexture(): THREE.CanvasTexture {
  if (textureCache['blackboard']) return textureCache['blackboard'];

  const [canvas, ctx] = create2DCanvas(1024, 384);

  // Dark matte green
  ctx.fillStyle = '#064E3B';
  ctx.fillRect(0, 0, 1024, 384);

  // Wooden frame
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 18;
  ctx.strokeRect(0, 0, 1024, 384);

  // Chalk writing
  ctx.fillStyle = '#F0FDF4';
  ctx.font = 'bold 36px "Segoe UI", serif';
  ctx.textAlign = 'center';
  ctx.fillText('TIÊN HỌC LỄ · HẬU HỌC VĂN', 512, 70);

  ctx.font = '24px "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Thứ Hai, ngày 05 tháng 11 năm 2026', 80, 130);
  ctx.fillText('Môn: Ngữ Văn - Thơ Nôm Hàn Thuyên & Văn Học Thăng Long', 80, 175);
  ctx.fillText('Toán: Tích Phân & Ứng Dụng Hình Học Không Gian', 80, 220);
  ctx.fillText('Vật Lý: Sóng Ánh Sáng & Lượng Tử Planck (E = h.f)', 80, 265);

  ctx.fillStyle = '#FDE047';
  ctx.font = 'italic 22px "Segoe UI", sans-serif';
  ctx.fillText('★ Quyết tâm đỗ nguyện vọng 1 - Niềm tự hào THPT Hàn Thuyên!', 80, 325);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['blackboard'] = tex;
  return tex;
}

// 9. Hàn Thuyên Memorial Stele Inscription Texture (Bia Đá Hàn Thuyên)
export function getSteleTexture(): THREE.CanvasTexture {
  if (textureCache['stele']) return textureCache['stele'];

  const [canvas, ctx] = create2DCanvas(512, 768);

  // Granite stone texture
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 512, 768);

  // Gold border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 512 - 40, 768 - 40);

  // Carved gold text
  ctx.fillStyle = '#FDE047';
  ctx.font = 'bold 34px "Segoe UI", serif';
  ctx.textAlign = 'center';
  ctx.fillText('DANH SĨ HÀN THUYÊN', 256, 90);

  ctx.font = 'italic 20px "Segoe UI", serif';
  ctx.fillText('(Nguyễn Thuyên - Danh sĩ thời nhà Trần)', 256, 130);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '19px "Segoe UI", sans-serif';
  const lines = [
    'Người đầu tiên dùng chữ Nôm làm thơ văn,',
    'mở đầu cho nền thơ phú tiếng mẹ đẻ nước Đại Việt.',
    ' ',
    'Tác giả bài "Văn tế cá sấu" trứ danh',
    'đuổi loài thủy quái trên sông Lô,',
    'được vua Trần Nhân Tông ban cho họ Hàn',
    'ngang với Hàn Dũ đời Đường.',
    ' ',
    'Thầy và trò trường THPT Hàn Thuyên',
    'nguyện noi gương hiếu học, sáng tạo,',
    'giữ gìn và phát huy bản sắc dân tộc.'
  ];

  let currY = 200;
  for (const line of lines) {
    ctx.fillText(line, 256, currY);
    currY += 42;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache['stele'] = tex;
  return tex;
}
