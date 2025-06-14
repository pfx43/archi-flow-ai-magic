
export interface Theme {
  name: string;
  category: string;
  palette: {
    nodeStroke: string;
    nodeText: string;
    connection: string;
    arrow: string;
    background: string;
    grid: string;
    nodeFill: string;
  };
}

export const themes: Theme[] = [
  {
    name: '克莱因蓝',
    category: '专业与科技风格',
    palette: {
      background: '#063273',
      nodeFill: '#0F34A8',
      nodeStroke: '#1383C2',
      nodeText: '#FFFFFF',
      connection: '#1383C2',
      arrow: '#20C2F1',
      grid: '#1383C2'
    }
  },
  {
    name: '瓦尔登蓝',
    category: '专业与科技风格',
    palette: {
      background: '#DCEEF8',
      nodeFill: '#FFFFFF',
      nodeStroke: '#77C3E3',
      nodeText: '#0F34A8',
      connection: '#B9E3FB',
      arrow: '#74E3F5',
      grid: '#B9E3FB'
    }
  },
  {
    name: '翡翠恋人',
    category: '活力与人文风格',
    palette: {
      background: '#F5FAF8',
      nodeFill: '#FFFFFF',
      nodeStroke: '#3B9A70',
      nodeText: '#317A5F',
      connection: '#83C5B7',
      arrow: '#27753B',
      grid: '#83C5B7'
    }
  },
  {
    name: '蜜桃乌龙',
    category: '活力与人文风格',
    palette: {
      background: '#F3E8D2',
      nodeFill: '#FFFFFF',
      nodeStroke: '#F0A6B3',
      nodeText: '#D9667E',
      connection: '#F4C1BD',
      arrow: '#ECBDD1',
      grid: '#F4C1BD'
    }
  },
  {
    name: '暮霭沉晨',
    category: '沉稳与柔和风格',
    palette: {
      background: '#E1E6F4',
      nodeFill: '#FFFFFF',
      nodeStroke: '#7DA2CE',
      nodeText: '#3E5474',
      connection: '#A4CBEC',
      arrow: '#6895BF',
      grid: '#A4CBEC'
    }
  },
  {
    name: '薄荷藕泥',
    category: '沉稳与柔和风格',
    palette: {
      background: '#ECEBF0',
      nodeFill: '#FFFFFF',
      nodeStroke: '#81ADA0',
      nodeText: '#59736B',
      connection: '#CFD2D1',
      arrow: '#7FBFA4',
      grid: '#CFD2D1'
    }
  },
  {
    name: '桂枝兰香',
    category: '背景与氛围营造',
    palette: {
      background: '#FFFDF0',
      nodeFill: '#F0F4A8',
      nodeStroke: '#F0D564',
      nodeText: '#556E46',
      connection: '#CFE9CE',
      arrow: '#9CC6A2',
      grid: '#CFE9CE'
    }
  },
  {
    name: '青青子衿',
    category: '背景与氛围营造',
    palette: {
      background: '#E6EFE6',
      nodeFill: '#FFFFFF',
      nodeStroke: '#8CA875',
      nodeText: '#556E46',
      connection: '#9AB69F',
      arrow: '#9AB69F',
      grid: '#9AB69F'
    }
  },
];
