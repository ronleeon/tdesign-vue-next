import { defineComponent, toRefs, PropType, ref, computed, h } from 'vue';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue-next';
import { abridgeName, getFileSizeText } from '../../_common/js/upload/utils';
import { TdUploadProps, UploadFile } from '../type';
import TLink from '../../link';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';
import useCommonClassName from '../../hooks/useCommonClassName';
import TLoading from '../../loading';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';

export interface DraggerProps extends CommonDisplayFileProps {
  trigger?: TdUploadProps['trigger'];
  triggerUpload?: (e: MouseEvent) => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent; file: UploadFile }) => void;
  dragEvents: UploadDragEvents;
}

export default defineComponent({
  name: 'UploadDraggerFile',

  props: {
    ...commonProps,
    trigger: Function as PropType<DraggerProps['trigger']>,
    triggerUpload: Function as PropType<DraggerProps['triggerUpload']>,
    uploadFiles: Function as PropType<DraggerProps['uploadFiles']>,
    cancelUpload: Function as PropType<DraggerProps['cancelUpload']>,
    dragEvents: Object as PropType<DraggerProps['dragEvents']>,
  },

  setup(props: DraggerProps, { slots }) {
    const { displayFiles, locale, disabled } = toRefs(props);

    const { sizeClassNames } = useCommonClassName();
    const uploadPrefix = `${props.classPrefix}-upload`;

    const drag = useDrag(props.dragEvents);
    const { dragActive } = drag;

    const draggerFileRef = ref();

    const classes = computed(() => [
      `${uploadPrefix}__dragger`,
      { [`${uploadPrefix}__dragger-center`]: !displayFiles.value[0] },
      { [`${uploadPrefix}__dragger-error`]: displayFiles.value[0]?.status === 'fail' },
    ]);

    const { CheckCircleFilledIcon, ErrorCircleFilledIcon } = useGlobalIcon({
      CheckCircleFilledIcon: TdCheckCircleFilledIcon,
      ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    });

    const renderImage = () => {
      const file = displayFiles.value[0];
      if (!file) return null;
      const url = file.url || file.response?.url;
      return (
        <div class={`${uploadPrefix}__dragger-img-wrap`}>
          {url && (
            <ImageViewer images={[url]} trigger={(h, { open }: any) => <img src={url} onClick={open} />}></ImageViewer>
          )}
        </div>
      );
    };

    const renderUploading = () => {
      const file = displayFiles.value[0];
      if (!file) return null;
      if (file.status === 'progress') {
        return (
          <div class={`${uploadPrefix}__single-progress`}>
            <TLoading />
            <span class={`${uploadPrefix}__single-percent`}>{file.percent}%</span>
          </div>
        );
      }
    };

    const renderMainPreview = () => {
      const file = displayFiles.value[0];
      if (!file) return null;
      const fileName = props.abridgeName ? abridgeName(file.name, ...props.abridgeName) : file.name;
      return (
        <div class={`${uploadPrefix}__dragger-progress`}>
          {props.theme === 'image' && renderImage()}
          <div class={`${uploadPrefix}__dragger-progress-info`}>
            <div class={`${uploadPrefix}__dragger-text`}>
              <span class={`${uploadPrefix}__single-name`}>{fileName}</span>
              {file.status === 'progress' && renderUploading()}
              {file.status === 'success' && <CheckCircleFilledIcon />}
              {file.status === 'fail' && <ErrorCircleFilledIcon />}
            </div>
            <small class={`${sizeClassNames.small}`}>
              {locale.value.file.fileSizeText}：{getFileSizeText(file.size)}
            </small>
            <small class={`${sizeClassNames.small}`}>
              {locale.value.file.fileOperationDateText}：{file.uploadTime || '-'}
            </small>
            <div class={`${uploadPrefix}__dragger-btns`}>
              {['progress', 'waiting'].includes(file.status) && !disabled && (
                <TLink
                  theme="primary"
                  hover="color"
                  class={`${uploadPrefix}__dragger-progress-cancel`}
                  onClick={(e: MouseEvent) =>
                    props.cancelUpload?.({
                      e,
                      file: props.toUploadFiles[0] || props.files[0],
                    })
                  }
                >
                  {locale.value?.cancelUploadText}
                </TLink>
              )}
              {!props.autoUpload && file.status === 'waiting' && (
                <TLink
                  theme="primary"
                  hover="color"
                  disabled={disabled.value}
                  onClick={() => props.uploadFiles?.()}
                  class={`${uploadPrefix}__dragger-upload-btn`}
                >
                  {locale.value.triggerUploadText.normal}
                </TLink>
              )}
            </div>
            {['fail', 'success'].includes(file?.status) && !disabled.value && (
              <div class={`${uploadPrefix}__dragger-btns`}>
                <TLink
                  theme="primary"
                  hover="color"
                  disabled={disabled.value}
                  class={`${uploadPrefix}__dragger-progress-cancel`}
                  onClick={props.triggerUpload}
                >
                  {locale.value.triggerUploadText.reupload}
                </TLink>
                <TLink
                  theme="danger"
                  hover="color"
                  disabled={disabled.value}
                  class={`${uploadPrefix}__dragger-delete-btn`}
                  onClick={(e: MouseEvent) => props.onRemove({ e, index: 0, file })}
                >
                  {locale.value.triggerUploadText.delete}
                </TLink>
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderDefaultDragElement = () => {
      const unActiveElement = (
        <div>
          <span class={`${uploadPrefix}--highlight`}>{locale.value.triggerUploadText?.normal}</span>
          <span>&nbsp;&nbsp;/&nbsp;&nbsp;{locale.value.dragger.draggingText}</span>
        </div>
      );
      const activeElement = <div>{locale.value.dragger.dragDropText}</div>;
      return dragActive.value ? activeElement : unActiveElement;
    };

    const getContent = () => {
      const file = displayFiles.value[0];
      if (file && ['progress', 'success', 'fail', 'waiting'].includes(file.status)) {
        return renderMainPreview();
      }
      return (
        <div class={`${uploadPrefix}__trigger`} onClick={props.triggerUpload}>
          {slots.default?.() || renderDefaultDragElement()}
        </div>
      );
    };

    return () => (
      <div
        ref={draggerFileRef}
        class={classes.value}
        onDrop={drag.handleDrop}
        onDragenter={drag.handleDragenter}
        onDragover={drag.handleDragover}
        onDragleave={drag.handleDragleave}
      >
        {props.trigger?.(h, { files: displayFiles.value, dragActive: dragActive.value }) || getContent()}
      </div>
    );
  },
});
