import { defineComponent, ref, toRefs, computed, inject } from 'vue';
import props from './props';
import useVModel from '../hooks/useVModel';
import { useFormDisabled } from '../form/hooks';
import useRipple from '../hooks/useRipple';
import { useContent } from '../hooks/tnode';
import { usePrefixClass } from '../hooks/useConfig';
import { CheckboxGroupInjectionKey } from './constants';

export default defineComponent({
  name: 'TCheckbox',
  props: {
    ...props,
    needRipple: Boolean,
    stopLabelTrigger: Boolean,
  },

  setup(props) {
    const labelRef = ref<HTMLElement>();
    if (props.needRipple) {
      useRipple(labelRef);
    }

    const { checked, modelValue } = toRefs(props);
    const [innerChecked, setInnerChecked] = useVModel(
      checked,
      modelValue,
      props.defaultChecked,
      props.onChange,
      'checked',
    );

    const checkboxGroup = inject(CheckboxGroupInjectionKey, undefined);
    const GroupDisabled = computed(() => {
      return props.disabled || !!checkboxGroup?.disabled;
    });
    const formDisabled = useFormDisabled(GroupDisabled);

    const name = computed<string>(() => props.name || checkboxGroup?.name);

    const selfChecked = computed<boolean>(() => {
      if (props.checkAll) return checkboxGroup?.isCheckAll;
      return checkboxGroup ? !!checkboxGroup.checkedMap[props.value] : innerChecked.value;
    });

    const disabled = computed<boolean>(() => {
      if (formDisabled) return formDisabled.value;
      if (!props.checkAll && !selfChecked.value && checkboxGroup?.maxExceeded) {
        return true;
      }
      if (props.disabled !== undefined) return props.disabled;
      return !!checkboxGroup?.disabled;
    });

    const selfIndeterminate = computed<boolean>(() => {
      if (props.checkAll) return checkboxGroup?.indeterminate;
      return props.indeterminate;
    });

    /** 样式计算相关逻辑 */
    const classPrefix = usePrefixClass();
    const COMPONENT_NAME = usePrefixClass('checkbox');
    const labelClasses = computed(() => [
      `${COMPONENT_NAME.value}`,
      {
        [`${classPrefix.value}-is-checked`]: selfChecked.value,
        [`${classPrefix.value}-is-disabled`]: disabled.value,
        [`${classPrefix.value}-is-indeterminate`]: selfIndeterminate.value,
      },
    ]);

    // methods
    const handleChange = (e: Event) => {
      if (props.readonly) return;
      const checked = !selfChecked.value;
      setInnerChecked(checked, { e });
      if (checkboxGroup && checkboxGroup.handleCheckboxChange) {
        checkboxGroup.onCheckedChange({ checked, checkAll: props.checkAll, e, option: props });
      }
    };

    const renderContent = useContent();

    const handleLabelClick = (e: MouseEvent) => {
      // 在tree等组件中使用  阻止label触发checked 与expand冲突
      if (props.stopLabelTrigger) e.preventDefault();
    };

    return () => (
      <label class={labelClasses.value} ref="labelRef">
        <input
          type="checkbox"
          class={`${COMPONENT_NAME.value}__former`}
          disabled={disabled.value}
          readonly={props.readonly}
          indeterminate={props.indeterminate}
          name={name.value}
          value={props.value}
          checked={selfChecked.value}
          onChange={handleChange}
        ></input>
        <span class={`${COMPONENT_NAME.value}__input`}></span>
        <span class={`${COMPONENT_NAME.value}__label`} onClick={handleLabelClick}>
          {renderContent('default', 'label')}
        </span>
      </label>
    );
  },
});
