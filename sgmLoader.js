import * as THREE from 'https://cdn.skypack.dev/three@v0.132.0';

class SGMLoader extends THREE.Loader {
  constructor(manager) {
    super(manager);
  }

  load(url, onLoad, onProgress, onError) {
    const loader = new THREE.FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType('arraybuffer');
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    loader.load(url, (data) => {
      try {
        const result = this.parse(data);
        onLoad(result);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          console.error(error);
        }
        this.manager.itemError(url);
      }
    }, onProgress, onError);
  }
  parse(data) {
    const buffer = new Uint8Array(data);
    let offset = 0;
  
    function readBytes(size) {
      const result = buffer.slice(offset, offset + size);
      offset += size;
      return result;
    }
  
    function readUInt8() {
      return readBytes(1)[0];
    }
  
    function readUInt16() {
      const bytes = readBytes(2);
      return (bytes[0] | (bytes[1] << 8)) >>> 0;
    }
  
    function readUInt32() {
      const bytes = readBytes(4);
      return (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)) >>> 0;
    }
  
    function readFloat32() {
      const bytes = readBytes(4);
      const view = new DataView(new ArrayBuffer(4));
      for (let i = 0; i < 4; i++) {
        view.setUint8(i, bytes[i]);
      }
      return view.getFloat32(0, true);
    }
  
    function readFloat32Array(count) {
      const result = new Array(count);
      for (let i = 0; i < count; i++) {
        result[i] = readFloat32();
      }
      return result;
    }
  
    function readString() {
      const length = readUInt16() - 1;
      const bytes = readBytes(length);
      readBytes(1); // skip null terminator
      return new TextDecoder("utf-8").decode(bytes);
    }
  
    const version = [readUInt32(), readUInt8()];
    console.log(version);
  
    const numMaterials = readUInt8();
    const materials = [];
    for (let i = 0; i < numMaterials; i++) {
      const materialId = readUInt8();
      const uvCount = readUInt8();
      
      const uvData = [];
      for (let j = 0; j < uvCount; j++) {
        const imageCount = readUInt8();
        const images = [];
        for (let k = 0; k < imageCount; k++) {
          const usageHint = readUInt8();
          const texname = readString();
          images.push([texname, usageHint]);
        }
        uvData.push(images);
      }
      const colorCount = readUInt8();
      const colors = [];
      for (let j = 0; j < colorCount; j++) {
        const colorId = readUInt8();
        const color = readFloat32Array(4);
        colors.push([color, colorId]);
      }
      materials.push({
        material_id: materialId,
        uv_data: uvData,
        colors: colors,
      });
    }
  
    const numMeshes = readUInt8();
    const meshes = [];
    let indexOffset = 0; // for multiple meshes
    for (let i = 0; i < numMeshes; i++) {
      const vertices = [];
      const indices = [];
      const meshId = readUInt8();
      const materialId = readUInt8();
      const vertexCount = readUInt32();
      const uvCount = readUInt8();
      const texdataCount = readUInt8();
      const hasTangents = readUInt8();
      const hasBones = readUInt8();
      for (let j = 0; j < vertexCount; j++) {
        const position = readFloat32Array(3);
        const normal = readFloat32Array(3);
        const uvs = [];
        for (let k = 0; k < uvCount; k++) {
          const uv = readFloat32Array(2);
          uvs.push(uv);
        }
        const color = texdataCount === 4 ? readFloat32Array(4) : null;
        const tangent = hasTangents ? readFloat32Array(4) : null;
        const weights = hasBones ? readFloat32Array(4) : null;
        const bones = hasBones ? readFloat32Array(4) : null;
        vertices.push([position, normal, uvs, color, tangent, weights, bones]);
      }
  
      const indexCount = readUInt32();
      const indexSize = readUInt8();
      for (let j = 0; j < indexCount; j++) {
        const index = indexSize === 4 ? readUInt32() : readUInt16();
        indices.push(index);
      }
  
      indexOffset += vertices.length;
      meshes.push({ mesh_id: meshId, material_id: materialId, vertices: vertices, indices: indices });
    }
  
    return [meshes, materials];
  }
}
export { SGMLoader };